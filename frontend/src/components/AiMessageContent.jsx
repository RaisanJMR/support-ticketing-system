import { Link } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import AiMarkdown from './AiMarkdown'
import { parseAiTicketSummary } from '../utils/aiTickets'

function AiMessageContent({ text, isError }) {
  if (isError) {
    return <p className='ai-chat-error-text'>{text}</p>
  }

  const { intro, tickets } = parseAiTicketSummary(text)

  if (!tickets.length) {
    return <AiMarkdown text={text} />
  }

  return (
    <div className='ai-message-content'>
      {intro && <AiMarkdown text={intro} />}
      <ul className='ai-ticket-list'>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link to={`/ticket/${ticket.id}`} className='ai-ticket-row'>
              <div className='ai-ticket-row-body'>
                <div className='ai-ticket-row-top'>
                  <span className='ai-ticket-product'>
                    {ticket.product || 'Ticket'}
                  </span>
                  <span className='ai-ticket-id' title={ticket.id}>
                    {ticket.id.slice(-8)}
                  </span>
                </div>
                {(ticket.customerName || ticket.customerEmail) && (
                  <p className='ai-ticket-customer'>
                    {ticket.customerName}
                    {ticket.customerEmail
                      ? ` · ${ticket.customerEmail}`
                      : ''}
                  </p>
                )}
                {ticket.description && (
                  <p className='ai-ticket-description'>{ticket.description}</p>
                )}
              </div>
              <IoChevronForward
                className='ai-ticket-chevron'
                aria-hidden='true'
              />
              <span className='visually-hidden'>Open ticket {ticket.id}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AiMessageContent
