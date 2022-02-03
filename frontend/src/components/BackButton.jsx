import { AiOutlineArrowLeft } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export const BackButton = ({ url }) => {
  return (
    <Link to={url} className='btn btn-reverse btn-back'>
      <AiOutlineArrowLeft /> Back
    </Link>
  )
}
