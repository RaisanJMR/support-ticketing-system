import { IoChevronBack } from 'react-icons/io5'
import { Link } from 'react-router-dom'

export const BackButton = ({ url, label = 'Back' }) => {
  return (
    <Link to={url} className='back-link'>
      <IoChevronBack aria-hidden='true' />
      {label}
    </Link>
  )
}
