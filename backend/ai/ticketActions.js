const Ticket = require('../models/TicketModel')
const Note = require('../models/NoteModel')

const MAX_TICKETS = 50

const ticketSummaryFields = {
  _id: 1,
  product: 1,
  description: 1,
  status: 1,
  createdAt: 1,
  updatedAt: 1,
}

async function listTickets({ status, product, limit } = {}) {
  const query = {}
  if (status) query.status = status
  if (product) query.product = product

  const tickets = await Ticket.find(query)
    .select(ticketSummaryFields)
    .populate('user', 'name email')
    .sort({ updatedAt: -1 })
    .limit(Math.min(limit || 30, MAX_TICKETS))
    .lean()

  return {
    count: tickets.length,
    tickets: tickets.map((ticket) => ({
      id: ticket._id.toString(),
      product: ticket.product,
      description: ticket.description,
      status: ticket.status,
      customerName: ticket.user?.name,
      customerEmail: ticket.user?.email,
      createdAt: ticket.createdAt?.toISOString?.() || String(ticket.createdAt),
      updatedAt: ticket.updatedAt?.toISOString?.() || String(ticket.updatedAt),
    })),
  }
}

async function countTickets({ status } = {}) {
  if (status) {
    const total = await Ticket.countDocuments({ status })
    const byStatus = { new: 0, open: 0, closed: 0 }
    byStatus[status] = total
    return { total, byStatus }
  }

  const grouped = await Ticket.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])
  const byStatus = { new: 0, open: 0, closed: 0 }
  for (const row of grouped) {
    if (row._id in byStatus) byStatus[row._id] = row.count
  }
  const total = byStatus.new + byStatus.open + byStatus.closed
  return { total, byStatus }
}

async function getTicket({ ticketId }) {
  const ticket = await Ticket.findById(ticketId).populate('user', 'name email').lean()
  if (!ticket) {
    return { found: false }
  }

  const notes = await Note.find({ ticket: ticketId })
    .populate('user', 'name')
    .sort({ createdAt: 1 })
    .lean()

  return {
    found: true,
    ticket: {
      id: ticket._id.toString(),
      product: ticket.product,
      description: ticket.description,
      status: ticket.status,
      customerName: ticket.user?.name,
      customerEmail: ticket.user?.email,
      createdAt: ticket.createdAt?.toISOString?.() || String(ticket.createdAt),
      updatedAt: ticket.updatedAt?.toISOString?.() || String(ticket.updatedAt),
      notes: notes.map((note) => ({
        text: note.text,
        isStaff: Boolean(note.isStaff),
        authorName: note.user?.name,
        createdAt: note.createdAt?.toISOString?.() || String(note.createdAt),
      })),
    },
  }
}

async function runTicketTool(name, args = {}) {
  switch (name) {
    case 'listTickets':
      return listTickets(args)
    case 'countTickets':
      return countTickets(args)
    case 'getTicket':
      return getTicket(args)
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

module.exports = {
  listTickets,
  countTickets,
  getTicket,
  runTicketTool,
}
