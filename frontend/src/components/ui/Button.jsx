import { Link } from 'react-router-dom'

function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  icon,
  to,
  type = 'button',
  disabled,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    block && 'btn-block',
    !children && 'btn-icon',
    loading && 'is-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {loading && <span className='btn-spinner' aria-hidden='true' />}
      <span className='btn-label'>
        {icon}
        {children}
      </span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}>
      {content}
    </button>
  )
}

export default Button
