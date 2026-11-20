function Skeleton({ width = '100%', height = 16, radius, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height, borderRadius: radius }}
      aria-hidden='true'
    />
  )
}

export default Skeleton
