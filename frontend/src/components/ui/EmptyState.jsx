function EmptyState({ icon, title, message, action, tone, compact = false }) {
  const classes = [
    'empty-state',
    compact && 'empty-state-compact',
    tone && `empty-state-${tone}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role={tone === 'error' ? 'alert' : undefined}>
      {icon && (
        <div className='empty-state-icon' aria-hidden='true'>
          {icon}
        </div>
      )}
      <h2 className='empty-state-title'>{title}</h2>
      {message && <p className='empty-state-message'>{message}</p>}
      {action && <div className='empty-state-action'>{action}</div>}
    </div>
  )
}

export default EmptyState
