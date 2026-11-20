import { formatDate, formatRelative } from '../utils/format'

function NoteItem({ note, currentUserId }) {
  const author = note.user && typeof note.user === 'object' ? note.user : null
  const authorId = author ? author._id : note.user
  const isMine = authorId === currentUserId
  const authorName = isMine
    ? 'You'
    : (author && author.name) || (note.isStaff ? 'Support team' : 'Customer')

  const classes = ['note', isMine && 'note-mine', note.isStaff && 'note-staff']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={classes}>
      <div className='note-meta'>
        <span className='note-author'>{authorName}</span>
        {note.isStaff && <span className='badge badge-staff'>Staff</span>}
        <time dateTime={note.createdAt} title={formatDate(note.createdAt)}>
          {formatRelative(note.createdAt)}
        </time>
      </div>
      <p className='note-bubble'>{note.text}</p>
    </li>
  )
}

export default NoteItem
