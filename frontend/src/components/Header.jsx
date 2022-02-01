import { AiOutlineLogin, AiOutlineUser, AiOutlineLogout } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>Support Desk</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className='btn' onClick={onLogout}>
              <AiOutlineLogout /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <AiOutlineLogin /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <AiOutlineUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
