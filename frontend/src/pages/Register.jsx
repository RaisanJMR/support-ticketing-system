import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoPersonAddOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { register, reset } from '../features/auth/authSlice'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    // Redirect when logged in
    if (isSuccess || user) {
      navigate('/')
    }
    dispatch(reset())
  }, [dispatch, navigate, isError, isSuccess, user, message])

  const passwordsMismatch = password2.length > 0 && password !== password2

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      return
    }
    const userData = {
      name,
      email,
      password,
    }
    dispatch(register(userData))
  }

  return (
    <div className='auth-page'>
      <Card className='auth-card'>
        <div className='auth-header'>
          <span className='auth-icon' aria-hidden='true'>
            <IoPersonAddOutline />
          </span>
          <h1 className='auth-title'>Create account</h1>
          <p className='auth-subtitle'>
            One account for all of your support requests.
          </p>
        </div>

        <form className='auth-form' onSubmit={onSubmit}>
          <Field
            id='name'
            name='name'
            type='text'
            label='Name'
            autoComplete='name'
            value={name}
            onChange={onChange}
            placeholder='Jane Appleseed'
            disabled={isLoading}
            required
          />
          <Field
            id='email'
            name='email'
            type='email'
            label='Email'
            autoComplete='email'
            value={email}
            onChange={onChange}
            placeholder='name@example.com'
            disabled={isLoading}
            required
          />
          <PasswordField
            id='password'
            name='password'
            label='Password'
            autoComplete='new-password'
            value={password}
            onChange={onChange}
            placeholder='Create a password'
            disabled={isLoading}
            required
          />
          <PasswordField
            id='password2'
            name='password2'
            label='Confirm password'
            autoComplete='new-password'
            value={password2}
            onChange={onChange}
            placeholder='Type it again'
            error={passwordsMismatch ? 'Passwords do not match.' : undefined}
            disabled={isLoading}
            required
          />
          <Button type='submit' size='lg' block loading={isLoading}>
            Create account
          </Button>
        </form>

        <p className='auth-footer'>
          Already have an account? <Link to='/login'>Sign in</Link>
        </p>
      </Card>
    </div>
  )
}

export default Register
