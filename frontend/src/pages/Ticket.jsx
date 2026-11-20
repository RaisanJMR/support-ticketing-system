import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  IoAlertCircleOutline,
  IoArrowUp,
  IoChatbubblesOutline,
  IoCopyOutline,
  IoLockClosedOutline,
} from 'react-icons/io5'
import {
  getTicket,
  closeTicket,
  updateTicket,
} from '../features/tickets/ticketSlice'
import { getNotes, createNote } from '../features/notes/noteSlice'
import NoteItem from '../components/NoteItem'
import PageHeader from '../components/ui/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import SegmentedControl from '../components/ui/SegmentedControl'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import Dialog from '../components/ui/Dialog'
import { STATUSES, STATUS_LABELS } from '../utils/tickets'
import { formatDate, formatRelative } from '../utils/format'

const statusOptions = STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}))

function TicketSkeleton() {
  return (
    <div role='status'>
      <span className='visually-hidden'>Loading ticket</span>
      <div aria-hidden='true'>
        <div className='page-header skeleton-lines'>
          <Skeleton width={80} height={16} />
          <Skeleton width={220} height={36} />
          <Skeleton width={160} height={16} />
        </div>
        <div className='ticket-layout'>
          <Card className='skeleton-lines'>
            <Skeleton width={90} height={12} />
            <Skeleton height={16} />
            <Skeleton width='80%' height={16} />
          </Card>
          <Card className='skeleton-lines'>
            <Skeleton width={70} height={12} />
            <Skeleton height={16} />
            <Skeleton height={16} />
            <Skeleton height={16} />
          </Card>
        </div>
      </div>
    </div>
  )
}

function NotesSkeleton() {
  return (
    <div className='note-list' aria-hidden='true'>
      <Skeleton width='60%' height={56} radius={18} />
      <Skeleton width='45%' height={56} radius={18} className='note-mine' />
    </div>
  )
}

function Ticket() {
  const { ticketId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  )
  const {
    notes,
    isLoading: notesIsLoading,
    isError: notesIsError,
  } = useSelector((state) => state.notes)

  const [noteText, setNoteText] = useState('')
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  const loadTicket = useCallback(() => {
    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  }, [dispatch, ticketId])

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  const isLoaded = ticket && ticket._id === ticketId

  if (isError && !isLoaded) {
    return (
      <EmptyState
        tone='error'
        icon={<IoAlertCircleOutline />}
        title='We could not load this ticket'
        message={message}
        action={
          <>
            <Button variant='secondary' onClick={loadTicket}>
              Try again
            </Button>
            <Button variant='plain' to='/tickets'>
              Back to tickets
            </Button>
          </>
        }
      />
    )
  }

  if (isLoading || !isLoaded) {
    return <TicketSkeleton />
  }

  const isClosed = ticket.status === 'closed'
  const customer =
    ticket.user && typeof ticket.user === 'object' ? ticket.user : null
  const noteLabel = user.isAdmin ? 'Add staff note' : 'Add note'

  const onNoteSubmit = async (e) => {
    e.preventDefault()
    const text = noteText.trim()
    if (!text) return
    setSending(true)
    try {
      await dispatch(createNote({ noteText: text, ticketId })).unwrap()
      setNoteText('')
    } catch (err) {
      toast.error(err)
    } finally {
      setSending(false)
    }
  }

  const onStatusChange = async (status) => {
    if (status === ticket.status) return
    setUpdatingStatus(true)
    try {
      await dispatch(updateTicket({ ticketId, status })).unwrap()
      toast.success(`Status changed to ${STATUS_LABELS[status]}`)
    } catch (err) {
      toast.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const onConfirmClose = async () => {
    setClosing(true)
    try {
      await dispatch(closeTicket(ticketId)).unwrap()
      toast.success('Request closed')
      navigate('/tickets')
    } catch (err) {
      toast.error(err)
      setClosing(false)
    }
  }

  const onCopyId = async () => {
    try {
      await navigator.clipboard.writeText(ticket._id)
      toast.success('Ticket ID copied')
    } catch {
      toast.error('Could not copy the ticket ID')
    }
  }

  let conversation
  if (notesIsLoading && !sending) {
    conversation = <NotesSkeleton />
  } else if (notesIsError && notes.length === 0) {
    conversation = (
      <p className='inline-error' role='alert'>
        <IoAlertCircleOutline aria-hidden='true' />
        Messages could not be loaded.
        <Button
          variant='plain'
          size='sm'
          onClick={() => dispatch(getNotes(ticketId))}>
          Try again
        </Button>
      </p>
    )
  } else if (notes.length === 0) {
    conversation = (
      <div className='note-list'>
        <EmptyState
          compact
          icon={<IoChatbubblesOutline />}
          title='No messages yet'
          message={
            isClosed
              ? 'This request was closed without any messages.'
              : user.isAdmin
              ? 'Reply to let the customer know you are on it.'
              : 'Add a note if you have more details to share.'
          }
        />
      </div>
    )
  } else {
    conversation = (
      <ol className='note-list'>
        {notes.map((note) => (
          <NoteItem key={note._id} note={note} currentUserId={user._id} />
        ))}
      </ol>
    )
  }

  return (
    <>
      <PageHeader
        back={{
          to: '/tickets',
          label: user.isAdmin ? 'All tickets' : 'Tickets',
        }}
        title={ticket.product}
        subtitle={`Submitted ${formatRelative(ticket.createdAt)}`}
        actions={<StatusBadge status={ticket.status} size='lg' />}
      />

      <div className='ticket-layout'>
        <div className='ticket-main'>
          <Card>
            <h2 className='card-title'>Issue</h2>
            <p className='ticket-description'>{ticket.description}</p>
          </Card>

          <section aria-labelledby='conversation-title'>
            <div className='section-header'>
              <h2 id='conversation-title' className='section-title'>
                Conversation
              </h2>
              {notes.length > 0 && (
                <span className='section-meta'>
                  {notes.length} {notes.length === 1 ? 'message' : 'messages'}
                </span>
              )}
            </div>

            {conversation}

            {isClosed ? (
              <p className='composer-closed'>
                <IoLockClosedOutline aria-hidden='true' />
                This request is closed. New notes are turned off.
              </p>
            ) : (
              <Card as='form' className='composer' onSubmit={onNoteSubmit}>
                <label htmlFor='noteText' className='visually-hidden'>
                  {noteLabel}
                </label>
                <textarea
                  id='noteText'
                  name='noteText'
                  className='composer-input'
                  rows={3}
                  placeholder={
                    user.isAdmin ? 'Reply as staff…' : 'Add a note for the team…'
                  }
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  disabled={sending}
                />
                <div className='composer-footer'>
                  <span className='composer-hint'>
                    {user.isAdmin
                      ? 'The customer will see this as a staff reply.'
                      : 'The support team will see this note.'}
                  </span>
                  <Button
                    type='submit'
                    size='sm'
                    icon={<IoArrowUp aria-hidden='true' />}
                    loading={sending}
                    disabled={!noteText.trim()}>
                    {user.isAdmin ? 'Send reply' : 'Add note'}
                  </Button>
                </div>
              </Card>
            )}
          </section>
        </div>

        <aside className='ticket-sidebar' aria-label='Ticket details'>
          <Card>
            <h2 className='card-title'>Details</h2>
            <dl className='detail-list'>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={ticket.status} />
                </dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{ticket.product}</dd>
              </div>
              {user.isAdmin && customer && (
                <div>
                  <dt>Customer</dt>
                  <dd>
                    {customer.name}
                    <span className='detail-sub'>{customer.email}</span>
                  </dd>
                </div>
              )}
              <div>
                <dt>Submitted</dt>
                <dd>
                  <time dateTime={ticket.createdAt}>
                    {formatDate(ticket.createdAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>
                  <time
                    dateTime={ticket.updatedAt}
                    title={formatDate(ticket.updatedAt)}>
                    {formatRelative(ticket.updatedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Ticket ID</dt>
                <dd className='detail-id'>
                  <code title={ticket._id}>{ticket._id}</code>
                  <Button
                    variant='plain'
                    size='sm'
                    icon={<IoCopyOutline />}
                    onClick={onCopyId}
                    aria-label='Copy ticket ID'
                  />
                </dd>
              </div>
            </dl>
          </Card>

          {user.isAdmin && (
            <Card>
              <h2 className='card-title'>Update status</h2>
              <SegmentedControl
                label='Ticket status'
                options={statusOptions}
                value={ticket.status}
                onChange={onStatusChange}
                disabled={updatingStatus}
                block
              />
              <p className='card-hint card-hint-after'>
                The customer sees the new status the next time they open this
                request.
              </p>
            </Card>
          )}

          {!user.isAdmin && !isClosed && (
            <Card>
              <h2 className='card-title'>Issue resolved?</h2>
              <p className='card-hint'>
                Close the request when you no longer need help.
              </p>
              <Button
                variant='destructive'
                block
                onClick={() => setConfirmOpen(true)}>
                Close request
              </Button>
            </Card>
          )}
        </aside>
      </div>

      <Dialog
        isOpen={confirmOpen}
        onClose={() => !closing && setConfirmOpen(false)}
        title='Close this request?'
        description='You can still read the conversation, but you will not be able to add new notes.'
        footer={
          <>
            <Button
              variant='secondary'
              onClick={() => setConfirmOpen(false)}
              disabled={closing}>
              Keep open
            </Button>
            <Button variant='danger' onClick={onConfirmClose} loading={closing}>
              Close request
            </Button>
          </>
        }
      />
    </>
  )
}

export default Ticket
