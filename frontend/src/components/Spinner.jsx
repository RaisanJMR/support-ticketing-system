function Spinner({ label = 'Loading' }) {
  return (
    <div className='page-spinner' role='status'>
      <span className='spinner' aria-hidden='true' />
      <span className='visually-hidden'>{label}</span>
    </div>
  )
}

export default Spinner
