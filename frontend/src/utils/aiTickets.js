const stripMd = (value = '') =>
  String(value)
    .replace(/\*\*/g, '')
    .replace(/^\*+\s*/, '')
    .trim()

/**
 * Pull ticket-like blocks out of an AI summary so the UI can show list rows.
 * Returns { intro, tickets } — tickets empty if none parsed.
 */
export function parseAiTicketSummary(text) {
  const raw = String(text || '').replace(/\r\n/g, '\n')
  if (!raw.trim()) return { intro: '', tickets: [] }

  const ticketIdPattern =
    /(?:^|\n)\s*(?:\d+\.\s*)?\*{0,2}\s*Ticket ID\s*:?\s*\*{0,2}\s*:?\s*([a-fA-F0-9]{24})/gi
  const matches = [...raw.matchAll(ticketIdPattern)]

  if (!matches.length) {
    return { intro: raw.trim(), tickets: [] }
  }

  const intro = raw.slice(0, matches[0].index).trim()
  const tickets = []

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length
    const block = raw.slice(start, end)
    const id = matches[i][1]

    const pick = (label) => {
      const re = new RegExp(
        String.raw`\*{0,2}\s*${label}\s*:?\s*\*{0,2}\s*:?\s*(.+?)(?:\n|$)`,
        'i'
      )
      const m = block.match(re)
      return m ? stripMd(m[1]) : ''
    }

    const customer = pick('Customer')
    let customerName = ''
    let customerEmail = ''
    if (customer) {
      const emailMatch = customer.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
      if (emailMatch) {
        customerName = emailMatch[1].trim()
        customerEmail = emailMatch[2].trim()
      } else {
        customerName = customer
      }
    }

    let description = ''
    const descMatch = block.match(
      /\*{0,2}\s*Description\s*:?\s*\*{0,2}\s*:?\s*([\s\S]+)/i
    )
    if (descMatch) {
      description = stripMd(descMatch[1])
        .split(/\n\s*(?:\d+\.\s*)?\*{0,2}\s*Ticket ID/i)[0]
        .replace(/\n+/g, ' ')
        .trim()
    }

    tickets.push({
      id,
      product: pick('Product'),
      description,
      customerName,
      customerEmail,
    })
  }

  return { intro, tickets }
}
