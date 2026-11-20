function Field({
  id,
  label,
  hint,
  error,
  as: Control = 'input',
  trailing,
  className = '',
  ...props
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`field${error ? ' has-error' : ''} ${className}`.trim()}>
      {label && (
        <label className='field-label' htmlFor={id}>
          {label}
        </label>
      )}
      <div className={`field-control-wrap${trailing ? ' has-trailing' : ''}`}>
        <Control
          id={id}
          className='field-control'
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId || hintId}
          {...props}
        />
        {trailing && <div className='field-trailing'>{trailing}</div>}
      </div>
      {error ? (
        <p id={errorId} className='field-error' role='alert'>
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className='field-hint'>
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export default Field
