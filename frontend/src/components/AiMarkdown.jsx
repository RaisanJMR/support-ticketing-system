function renderInline(text, keyPrefix) {
  const nodes = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let lastIndex = 0
  let match
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i++}`}>{token.slice(2, -2)}</strong>
      )
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={`${keyPrefix}-c-${i++}`}>{token.slice(1, -1)}</code>
      )
    } else {
      nodes.push(<em key={`${keyPrefix}-e-${i++}`}>{token.slice(1, -1)}</em>)
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function AiMarkdown({ text }) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (orderedMatch) {
      const items = []
      while (i < lines.length) {
        const current = lines[i].trim()
        if (!current) {
          i += 1
          if (
            i < lines.length &&
            !/^\d+\.\s+/.test(lines[i].trim()) &&
            !/^[-*]\s+/.test(lines[i].trim())
          ) {
            break
          }
          continue
        }

        const itemMatch = current.match(/^(\d+)\.\s+(.*)$/)
        if (itemMatch) {
          const children = [itemMatch[2]]
          i += 1
          while (i < lines.length) {
            const nested = lines[i].trim()
            if (/^[-*]\s+/.test(nested)) {
              children.push(nested.replace(/^[-*]\s+/, ''))
              i += 1
              continue
            }
            break
          }
          items.push(children)
          continue
        }

        if (/^[-*]\s+/.test(current) && items.length) {
          items[items.length - 1].push(current.replace(/^[-*]\s+/, ''))
          i += 1
          continue
        }

        break
      }

      blocks.push(
        <ol key={`ol-${blocks.length}`} className='ai-md-ol'>
          {items.map((parts, idx) => (
            <li key={`oli-${idx}`}>
              <div>{renderInline(parts[0], `oli-${idx}`)}</div>
              {parts.length > 1 && (
                <ul className='ai-md-ul'>
                  {parts.slice(1).map((child, childIdx) => (
                    <li key={`olc-${idx}-${childIdx}`}>
                      {renderInline(child, `olc-${idx}-${childIdx}`)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length) {
        const current = lines[i].trim()
        if (!current) {
          i += 1
          break
        }
        if (!/^[-*]\s+/.test(current)) break
        items.push(current.replace(/^[-*]\s+/, ''))
        i += 1
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`} className='ai-md-ul'>
          {items.map((item, idx) => (
            <li key={`uli-${idx}`}>{renderInline(item, `uli-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    const paragraph = [trimmed]
    i += 1
    while (i < lines.length) {
      const next = lines[i].trim()
      if (!next || /^\d+\.\s+/.test(next) || /^[-*]\s+/.test(next)) break
      paragraph.push(next)
      i += 1
    }
    blocks.push(
      <p key={`p-${blocks.length}`} className='ai-md-p'>
        {renderInline(paragraph.join(' '), `p-${blocks.length}`)}
      </p>
    )
  }

  return <div className='ai-markdown'>{blocks}</div>
}

export default AiMarkdown
