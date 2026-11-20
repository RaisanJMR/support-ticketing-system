import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  IoArrowForward,
  IoChatbubblesOutline,
  IoCreateOutline,
  IoPulseOutline,
  IoTicketOutline,
} from 'react-icons/io5'
import { getTickets, reset } from '../features/tickets/ticketSlice'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Skeleton from '../components/ui/Skeleton'
import { STATUSES, STATUS_LABELS } from '../utils/tickets'
import { getGreeting } from '../utils/format'

const features = [
  {
    icon: <IoCreateOutline />,
    title: 'Open a request in a minute',
    text: 'Pick your device, describe the issue, and you are done.',
  },
  {
    icon: <IoChatbubblesOutline />,
    title: 'One clear conversation',
    text: 'Every reply from the support team lives with your request.',
  },
  {
    icon: <IoPulseOutline />,
    title: 'Always know the status',
    text: 'See at a glance what is new, in progress, or resolved.',
  },
]

function Home() {
  const { user } = useSelector((state) => state.auth)
  const { tickets, isLoading } = useSelector((state) => state.tickets)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) return
    dispatch(getTickets())
    return () => {
      dispatch(reset())
    }
  }, [user, dispatch])

  if (!user) {
    return (
      <>
        <section className='hero'>
          <p className='eyebrow'>Support Desk</p>
          <h1 className='hero-title'>Support, simplified.</h1>
          <p className='hero-subtitle'>
            Get help with your iPhone, iPad, Mac, or AirTag. Open a request and
            follow every reply in one place.
          </p>
          <div className='hero-actions'>
            <Button to='/register' size='lg'>
              Create account
            </Button>
            <Button to='/login' variant='secondary' size='lg'>
              Sign in
            </Button>
          </div>
        </section>
        <ul className='feature-grid'>
          {features.map((feature) => (
            <Card as='li' key={feature.title}>
              <div className='feature-icon' aria-hidden='true'>
                {feature.icon}
              </div>
              <h2 className='feature-title'>{feature.title}</h2>
              <p className='feature-text'>{feature.text}</p>
            </Card>
          ))}
        </ul>
      </>
    )
  }

  const firstName = user.name.split(' ')[0]
  const counts = STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: tickets.filter((ticket) => ticket.status === status).length,
    }),
    {}
  )

  return (
    <>
      <PageHeader
        title={`${getGreeting()}, ${firstName}.`}
        subtitle={
          user.isAdmin
            ? 'Here is what is waiting for the support team.'
            : 'How can we help today?'
        }
      />

      <div className='action-grid'>
        <Link to='/new-ticket' className='action-card action-card-primary'>
          <span className='action-card-icon' aria-hidden='true'>
            <IoCreateOutline />
          </span>
          <span className='action-card-title'>Start a new request</span>
          <span className='action-card-text'>
            Tell us what is wrong and the team will take it from there.
          </span>
          <span className='action-card-cta'>
            Get started <IoArrowForward aria-hidden='true' />
          </span>
        </Link>
        <Link to='/tickets' className='action-card'>
          <span className='action-card-icon' aria-hidden='true'>
            <IoTicketOutline />
          </span>
          <span className='action-card-title'>
            {user.isAdmin ? 'Review all tickets' : 'View your tickets'}
          </span>
          <span className='action-card-text'>
            {user.isAdmin
              ? 'Reply to customers and keep every status up to date.'
              : 'Check progress and read replies from the support team.'}
          </span>
          <span className='action-card-cta'>
            Open tickets <IoArrowForward aria-hidden='true' />
          </span>
        </Link>
      </div>

      <section aria-labelledby='overview-title'>
        <div className='section-header'>
          <h2 id='overview-title' className='section-title'>
            {user.isAdmin ? 'All requests' : 'Your requests'}
          </h2>
          <Link to='/tickets' className='section-meta'>
            See all
          </Link>
        </div>
        <div className='stat-grid'>
          {STATUSES.map((status) => (
            <Link
              key={status}
              to={`/tickets?status=${status}`}
              className='stat-card'>
              {isLoading ? (
                <Skeleton width={40} height={36} />
              ) : (
                <span className='stat-value'>{counts[status]}</span>
              )}
              <span className='stat-label'>
                <span
                  className={`stat-dot stat-dot-${status}`}
                  aria-hidden='true'
                />
                {STATUS_LABELS[status]}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
