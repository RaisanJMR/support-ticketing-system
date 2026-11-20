import { Link } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import ProductIcon from './ProductIcon'
import StatusBadge from './ui/StatusBadge'
import { formatDate, formatRelative } from '../utils/format'

function TicketItem({ ticket, showCustomer }) {
  const customerName =
    ticket.user && typeof ticket.user === 'object' ? ticket.user.name : ''

  return (
    <li>
      <Link to={`/ticket/${ticket._id}`} className='ticket-row'>
        <span className='ticket-row-icon'>
          <ProductIcon product={ticket.product} />
        </span>
        <span className='ticket-row-main'>
          <span className='ticket-row-title'>{ticket.product}</span>
          <span className='ticket-row-desc'>{ticket.description}</span>
        </span>
        <span className='ticket-row-meta'>
          {showCustomer && customerName && (
            <span className='ticket-row-customer'>{customerName}</span>
          )}
          <time dateTime={ticket.createdAt} title={formatDate(ticket.createdAt)}>
            {formatRelative(ticket.createdAt)}
          </time>
        </span>
        <StatusBadge status={ticket.status} />
        <IoChevronForward className='ticket-row-chevron' aria-hidden='true' />
      </Link>
    </li>
  )
}

export default TicketItem
