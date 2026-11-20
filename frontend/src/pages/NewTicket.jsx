import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createTicket, reset } from '../features/tickets/ticketSlice'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import ProductIcon from '../components/ProductIcon'
import { PRODUCTS } from '../utils/tickets'
import { getInitials } from '../utils/format'

function NewTicket() {
  const { user } = useSelector((state) => state.auth)
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  )

  const [product, setProduct] = useState('iPhone')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(reset())
  }, [dispatch])

  useEffect(() => {
    if (!submitted) return
    if (isError) {
      toast.error(message)
      setSubmitted(false)
      dispatch(reset())
    }
    if (isSuccess) {
      toast.success('Your request has been submitted')
      dispatch(reset())
      navigate('/tickets')
    }
  }, [submitted, dispatch, isError, isSuccess, navigate, message])

  const submitting = submitted && isLoading

  const onSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) return
    setSubmitted(true)
    dispatch(createTicket({ product, description: description.trim() }))
  }

  return (
    <div className='narrow'>
      <PageHeader
        back={{ to: '/', label: 'Home' }}
        title='New request'
        subtitle='Tell us what is going on and the support team will pick it up.'
      />

      <Card as='form' onSubmit={onSubmit}>
        <fieldset className='fieldset' disabled={submitting}>
          <legend className='fieldset-legend'>Which product needs help?</legend>
          <div className='product-grid'>
            {PRODUCTS.map((item) => (
              <label key={item} className='product-option'>
                <input
                  type='radio'
                  name='product'
                  value={item}
                  checked={product === item}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <span className='product-option-body'>
                  <ProductIcon product={item} />
                  <span>{item}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          as='textarea'
          id='description'
          name='description'
          label='Describe the issue'
          hint='Include what happened, when it started, and anything you have already tried.'
          placeholder='For example: my iPhone restarts every time I open the camera.'
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          required
        />

        <div className='submitter'>
          <span className='avatar' aria-hidden='true'>
            {getInitials(user.name)}
          </span>
          <span className='submitter-text'>
            Submitting as <strong>{user.name}</strong> · {user.email}
          </span>
        </div>

        <div className='form-actions'>
          <Button to='/' variant='secondary'>
            Cancel
          </Button>
          <Button
            type='submit'
            loading={submitting}
            disabled={!description.trim()}>
            Submit request
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default NewTicket
