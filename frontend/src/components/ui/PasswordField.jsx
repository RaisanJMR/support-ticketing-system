import { useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import Field from './Field'

function PasswordField(props) {
  const [visible, setVisible] = useState(false)

  return (
    <Field
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type='button'
          className='field-toggle'
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}>
          {visible ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
      }
    />
  )
}

export default PasswordField
