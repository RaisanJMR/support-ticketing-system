import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { AiFillPlusCircle, AiFillCloseCircle } from 'react-icons/ai'
import { getTicket, closeTicket } from '../features/tickets/ticketSlice'
import {
  getNotes,
  createNote,
  reset as notesReset,
} from '../features/notes/noteSlice'
import { BackButton } from '../components/BackButton'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import { useEffect, useState } from 'react'

const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  },
}

Modal.setAppElement('#root')

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const { ticket, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.tickets
  )

  const {
    notes,
    isLoading: notesIsLoading,
    isSuccess: notesIsSuccess,
    isError: notesIsError,
    message: notesMessage,
  } = useSelector((state) => state.notes)

  const params = useParams()
  const { ticketId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  }, [isError, message, ticketId, dispatch])

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
    toast.success('ticket closed')
    navigate('/tickets')
  }
  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({ noteText, ticketId }))
    closeModal()
  }
  const openModal = () => {
    setModalIsOpen(true)
  }
  const closeModal = () => {
    setModalIsOpen(false)
  }

  if (isLoading || notesIsLoading) {
    return <Spinner />
  }

  if (isError || notesIsError) {
    return <h3>Somenthing went wrong</h3>
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton url='/tickets' />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>{' '}
        </h2>
        <h3>
          Date submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className='ticket-desc'>
          <h3>Description of issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== 'closed' && (
        <button className='btn' onClick={openModal}>
          <AiFillPlusCircle />
          Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Add Note'>
        <h2>Add Note</h2>
        <button className='btn-close' onClick={closeModal}>
          <AiFillCloseCircle />
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className='form-group'>
            <textarea
              name='noteText'
              id='noteText'
              className='form-control'
              placeholder='note text'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}></textarea>
          </div>
          <div className='form-group'>
            <button className='btn' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== 'closed' && (
        <button className='btn btn-block btn-danger' onClick={onTicketClose}>
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket
