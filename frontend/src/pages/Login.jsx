import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'

import { login, reset } from '../features/auth/authSlice'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import PasswordField from '../components/ui/PasswordField'
import Button from '../components/ui/Button'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData
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

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }

  return (
    <div className='auth-page'>
      <Card className='auth-card'>
        <div className='auth-header'>
          <span className='auth-icon' aria-hidden='true'>
            <IoChatbubblesOutline />
          </span>
          <h1 className='auth-title'>Sign in</h1>
          <p className='auth-subtitle'>
            Open and track your support requests.
          </p>
        </div>

        <form className='auth-form' onSubmit={onSubmit}>
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
            autoComplete='current-password'
            value={password}
            onChange={onChange}
            placeholder='Your password'
            disabled={isLoading}
            required
          />
          <Button type='submit' size='lg' block loading={isLoading}>
            Sign in
          </Button>
        </form>

        <p className='auth-footer'>
          New here? <Link to='/register'>Create an account</Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
