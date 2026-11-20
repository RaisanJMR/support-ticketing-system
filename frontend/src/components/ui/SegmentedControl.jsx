import { useRef } from 'react'

function SegmentedControl({
  label,
  options,
  value,
  onChange,
  block = false,
  disabled = false,
}) {
  const optionRefs = useRef([])
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  )

  const onKeyDown = (e) => {
    const last = options.length - 1
    let next
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = selectedIndex === last ? 0 : selectedIndex + 1
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = selectedIndex === 0 ? last : selectedIndex - 1
    } else if (e.key === 'Home') {
      next = 0
    } else if (e.key === 'End') {
      next = last
    } else {
      return
    }
    e.preventDefault()
    onChange(options[next].value)
    optionRefs.current[next]?.focus()
  }

  return (
    <div
      className={`segmented${block ? ' segmented-block' : ''}`}
      role='radiogroup'
      aria-label={label}>
      {options.map((option, index) => {
        const selected = index === selectedIndex
        return (
          <button
            key={option.value}
            ref={(el) => (optionRefs.current[index] = el)}
            type='button'
            role='radio'
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={`segmented-option${selected ? ' is-selected' : ''}`}
            onClick={() => onChange(option.value)}
            onKeyDown={onKeyDown}
            disabled={disabled}>
            {option.label}
            {option.count !== undefined && (
              <span className='segmented-count'>{option.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
