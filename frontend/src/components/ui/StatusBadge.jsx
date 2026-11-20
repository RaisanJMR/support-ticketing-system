import { STATUS_LABELS } from '../../utils/tickets'

function StatusBadge({ status, size = 'md' }) {
  return (
    <span className={`badge badge-${status}${size === 'lg' ? ' badge-lg' : ''}`}>
      <span className='badge-dot' aria-hidden='true' />
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default StatusBadge
