import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  IoAdd,
  IoAlertCircleOutline,
  IoFileTrayOutline,
  IoSearchOutline,
} from 'react-icons/io5'
import { getTickets, reset } from '../features/tickets/ticketSlice'
import TicketItem from '../components/TicketItem'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import SegmentedControl from '../components/ui/SegmentedControl'
import Skeleton from '../components/ui/Skeleton'
import { PRODUCTS, STATUSES, STATUS_LABELS } from '../utils/tickets'

function TicketListSkeleton() {
  return (
    <div role='status'>
      <span className='visually-hidden'>Loading tickets</span>
      <ul className='ticket-list card' aria-hidden='true'>
        {[0, 1, 2, 3].map((row) => (
          <li key={row}>
            <div className='ticket-row'>
              <Skeleton width={40} height={40} radius={10} />
              <div className='ticket-row-main skeleton-lines'>
                <Skeleton width='35%' height={16} />
                <Skeleton width='70%' height={14} />
              </div>
              <Skeleton width={72} height={14} />
              <Skeleton width={64} height={24} radius={12} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Tickets() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { tickets, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  )
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const statusParam = searchParams.get('status')
  const productParam = searchParams.get('product')
  const statusFilter = STATUSES.includes(statusParam) ? statusParam : 'all'
  const productFilter = PRODUCTS.includes(productParam) ? productParam : 'all'

  useEffect(() => {
    return () => {
      if (isSuccess) {
        dispatch(reset())
      }
    }
  }, [dispatch, isSuccess])

  useEffect(() => {
    dispatch(getTickets())
  }, [dispatch])

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [tickets]
  )

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => setSearchParams({}, { replace: true })

  const productTickets =
    productFilter === 'all'
      ? sortedTickets
      : sortedTickets.filter((ticket) => ticket.product === productFilter)
  const visibleTickets =
    statusFilter === 'all'
      ? productTickets
      : productTickets.filter((ticket) => ticket.status === statusFilter)

  const statusOptions = [
    { value: 'all', label: 'All', count: productTickets.length },
    ...STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
      count: productTickets.filter((ticket) => ticket.status === status)
        .length,
    })),
  ]

  const activeCount = tickets.filter((ticket) => ticket.status !== 'closed')
    .length
  const subtitle =
    !isLoading && tickets.length > 0
      ? `${activeCount} active · ${tickets.length} total`
      : user.isAdmin
      ? 'Every request from every customer.'
      : 'Track your requests and replies from the team.'

  let content
  if (isLoading) {
    content = <TicketListSkeleton />
  } else if (isError) {
    content = (
      <EmptyState
        tone='error'
        icon={<IoAlertCircleOutline />}
        title='We could not load your tickets'
        message={message}
        action={
          <Button variant='secondary' onClick={() => dispatch(getTickets())}>
            Try again
          </Button>
        }
      />
    )
  } else if (tickets.length === 0) {
    content = (
      <EmptyState
        icon={<IoFileTrayOutline />}
        title={user.isAdmin ? 'No tickets yet' : 'No requests yet'}
        message={
          user.isAdmin
            ? 'New customer requests will show up here.'
            : 'When you open a request, you can follow its progress here.'
        }
        action={
          !user.isAdmin && (
            <Button to='/new-ticket' icon={<IoAdd />}>
              New request
            </Button>
          )
        }
      />
    )
  } else if (visibleTickets.length === 0) {
    content = (
      <EmptyState
        compact
        icon={<IoSearchOutline />}
        title='No matching tickets'
        message='Try a different status or product.'
        action={
          <Button variant='secondary' onClick={clearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  } else {
    content = (
      <ul className='ticket-list card' aria-label='Tickets'>
        {visibleTickets.map((ticket) => (
          <TicketItem
            key={ticket._id}
            ticket={ticket}
            showCustomer={user.isAdmin}
          />
        ))}
      </ul>
    )
  }

  return (
    <>
      <PageHeader
        title={user.isAdmin ? 'All tickets' : 'Tickets'}
        subtitle={subtitle}
        actions={
          <Button to='/new-ticket' icon={<IoAdd />}>
            New request
          </Button>
        }
      />

      {!isLoading && !isError && tickets.length > 0 && (
        <div className='toolbar'>
          <SegmentedControl
            label='Filter by status'
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setFilter('status', value)}
          />
          <div className='toolbar-filter'>
            <label htmlFor='productFilter' className='visually-hidden'>
              Filter by product
            </label>
            <select
              id='productFilter'
              className='field-control toolbar-select'
              value={productFilter}
              onChange={(e) => setFilter('product', e.target.value)}>
              <option value='all'>All products</option>
              {PRODUCTS.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {content}
    </>
  )
}

export default Tickets
