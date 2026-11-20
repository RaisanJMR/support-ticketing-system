import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  IoAddCircleOutline,
  IoChatbubblesOutline,
  IoLogOutOutline,
  IoTicketOutline,
} from 'react-icons/io5'
import { logout, reset } from '../features/auth/authSlice'
import Button from './ui/Button'
import { getInitials } from '../utils/format'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const onLogout = () => {
    setMenuOpen(false)
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const onTicketSection =
    location.pathname === '/tickets' || location.pathname.startsWith('/ticket/')

  const navLinks = user
    ? [
        {
          to: '/tickets',
          label: user.isAdmin ? 'All tickets' : 'Tickets',
          icon: <IoTicketOutline aria-hidden='true' />,
          active: onTicketSection,
        },
        {
          to: '/new-ticket',
          label: 'New request',
          icon: <IoAddCircleOutline aria-hidden='true' />,
          active: location.pathname === '/new-ticket',
        },
      ]
    : []

  return (
    <header className='site-header'>
      <div className='container site-header-inner'>
        <Link to='/' className='brand'>
          <span className='brand-mark' aria-hidden='true'>
            <IoChatbubblesOutline />
          </span>
          <span>Support</span>
        </Link>

        {user && (
          <nav className='site-nav' aria-label='Main'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link${link.active ? ' is-active' : ''}`}
                aria-current={link.active ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className='site-header-actions'>
          {user ? (
            <div className='user-menu' ref={menuRef}>
              <button
                ref={triggerRef}
                type='button'
                className='avatar-button'
                aria-haspopup='true'
                aria-expanded={menuOpen}
                aria-controls='account-menu'
                onClick={() => setMenuOpen((open) => !open)}>
                <span className='avatar' aria-hidden='true'>
                  {getInitials(user.name)}
                </span>
                <span className='visually-hidden'>
                  Account menu for {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className='menu' id='account-menu'>
                  <div className='menu-profile'>
                    <span className='avatar avatar-lg' aria-hidden='true'>
                      {getInitials(user.name)}
                    </span>
                    <div>
                      <p className='menu-name'>
                        {user.name}
                        {user.isAdmin && (
                          <span className='badge badge-staff'>Staff</span>
                        )}
                      </p>
                      <p className='menu-email'>{user.email}</p>
                    </div>
                  </div>
                  <nav className='menu-nav' aria-label='Main'>
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`menu-item${link.active ? ' is-active' : ''}`}
                        aria-current={link.active ? 'page' : undefined}>
                        {link.icon}
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <button
                    type='button'
                    className='menu-item menu-item-danger'
                    onClick={onLogout}>
                    <IoLogOutOutline aria-hidden='true' />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to='/login'
                className={({ isActive }) =>
                  `nav-link${isActive ? ' is-active' : ''}`
                }>
                Sign in
              </NavLink>
              <Button to='/register' size='sm'>
                Create account
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
