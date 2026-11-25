const asyncHandler = require('express-async-handler')

// @desc    Staff AI chat (ticket summaries via Gemini tools)
// @route   POST /api/ai/chat
// @access  Private/Admin
const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400)
    throw new Error('Please provide a message')
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(503)
    throw new Error(
      'GEMINI_API_KEY is not configured. Add it to the root .env file.'
    )
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.text === 'string'
        )
        .map((item) => ({
          role: item.role,
          text: item.text.slice(0, 4000),
        }))
        .slice(-12)
    : []

  try {
    // Lazy-load so a missing/ incompatible GenAI SDK does not crash boot
    const { runChat } = require('../ai/chat')
    const result = await runChat({
      message: message.trim().slice(0, 4000),
      history: safeHistory,
    })
    res.status(200).json({ text: result.text })
  } catch (err) {
    console.error('AI chat error:', err)
    const msg = err?.message || 'AI request failed'
    if (/API key|PERMISSION|UNAUTHENTICATED|invalid.*key|401/i.test(msg)) {
      res.status(503)
      throw new Error('Gemini API key is missing or invalid.')
    }
    if (
      err?.status === 'UNAVAILABLE' ||
      err?.code === 503 ||
      /UNAVAILABLE|high demand|try again later|503|Service Unavailable/i.test(
        msg
      )
    ) {
      res.status(503)
      throw new Error(
        'Gemini is busy right now. Please wait a moment and try again.'
      )
    }
    res.status(500)
    throw new Error(msg)
  }
})

module.exports = { chat }
