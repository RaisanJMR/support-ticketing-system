const { getAI, MODEL_CANDIDATES } = require('./client')
const { TICKET_TOOLS } = require('./tools')
const { runTicketTool } = require('./ticketActions')

const SYSTEM_PROMPT = `You are an AI assistant for staff on a product support ticketing desk.
Products supported: iPhone, iPad, Macbook Pro, iMac, AirTag.
Ticket statuses: new, open, closed.

Rules:
- When the user asks to summarize, list, count, or analyze tickets, you MUST call the available tools to load real data first. Never invent tickets.
- For "summarize open tickets" use listTickets with status "open" (and countTickets if helpful).
- For "summarize closed tickets" use listTickets with status "closed".
- For "new" tickets use status "new". If they say "active" or "unresolved", treat as new + open.
- Summaries should include: totals, breakdown by product when useful, common themes from descriptions, and a short bullet list of notable tickets.
- Be concise and actionable for support staff.
- If tools return no tickets, say so clearly.`

const MAX_TOOL_TURNS = 6

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function isRetryable(err) {
  const msg = err?.message || String(err)
  const code = err?.error?.code || err?.code || err?.status
  return (
    code === 'service_unavailable' ||
    code === 'UNAVAILABLE' ||
    code === 503 ||
    /UNAVAILABLE|high demand|try again later|503|Service Unavailable|overloaded|NOT_FOUND|no longer available|404/i.test(
      msg
    )
  )
}

function buildInput(message, history = []) {
  const prior = (history || [])
    .filter((item) => item?.text?.trim())
    .slice(-12)
    .map(
      (item) =>
        `${item.role === 'assistant' ? 'Assistant' : 'User'}: ${item.text}`
    )
    .join('\n')

  if (!prior) return message
  return `Conversation so far:\n${prior}\n\nUser: ${message}`
}

function getOutputs(interaction) {
  return interaction?.outputs || interaction?.steps || []
}

function extractText(interaction) {
  if (interaction?.output_text) return interaction.output_text
  if (typeof interaction?.text === 'string') return interaction.text

  const parts = []
  for (const item of getOutputs(interaction)) {
    if (!item) continue
    if (item.type === 'text' && item.text) parts.push(item.text)
    else if (typeof item.text === 'string') parts.push(item.text)
    else if (item.type === 'message' && item.content) {
      for (const c of item.content) {
        if (c?.text) parts.push(c.text)
      }
    }
  }
  return parts.join('\n').trim()
}

function getFunctionCalls(interaction) {
  return getOutputs(interaction).filter((item) => item?.type === 'function_call')
}

async function createWithFallback(ai, params) {
  let lastError
  for (let i = 0; i < MODEL_CANDIDATES.length; i++) {
    const model = MODEL_CANDIDATES[i]
    try {
      const interaction = await ai.interactions.create({ ...params, model })
      return { interaction, model }
    } catch (err) {
      lastError = err
      console.warn(`AI model ${model} failed:`, err?.message || err)
      if (!isRetryable(err)) throw err
      if (i < MODEL_CANDIDATES.length - 1) await sleep(800)
    }
  }
  throw lastError
}

async function runToolLoop(ai, interaction, model) {
  let current = interaction

  for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
    const calls = getFunctionCalls(current)
    if (!calls.length) break

    const results = []
    for (const call of calls) {
      const args = call.arguments || call.args || {}
      const result = await runTicketTool(call.name, args)
      results.push({
        type: 'function_result',
        name: call.name,
        call_id: call.id || call.call_id,
        result,
      })
    }

    current = await ai.interactions.create({
      model,
      previous_interaction_id: current.id,
      input: results,
      tools: TICKET_TOOLS,
    })
  }

  return current
}

async function runChat({ message, history }) {
  const ai = getAI()
  const { interaction: started, model } = await createWithFallback(ai, {
    system_instruction: SYSTEM_PROMPT,
    input: buildInput(message, history),
    tools: TICKET_TOOLS,
  })

  const interaction = await runToolLoop(ai, started, model)
  const text = extractText(interaction)
  return {
    text: text || 'I could not generate a response. Please try again.',
  }
}

module.exports = { runChat }
