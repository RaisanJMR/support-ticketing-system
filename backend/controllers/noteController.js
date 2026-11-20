const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const Ticket = require('../models/TicketModel')
const Note = require('../models/NoteModel')

// @desc Get note for a Tickets
// @route GET /api/tickets/:ticketId/notes
// @access Private

const getNotes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.findById(req.params.ticketId)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }
  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403)
    throw new Error('User not authorized')
  }
  const notes = await Note.find({ ticket: req.params.ticketId }).populate(
    'user',
    'name'
  )
  res.status(200).json(notes)
})
// @desc Create ticket note
// @route POST /api/tickets/:ticketId/notes
// @access Private

const addNote = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.findById(req.params.ticketId)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }
  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403)
    throw new Error('User not authorized')
  }
  const isStaff = Boolean(req.user.isAdmin)
  const note = await Note.create({
    text: req.body.text,
    isStaff,
    ticket: req.params.ticketId,
    user: req.user.id,
    ...(isStaff && { staffId: req.user.id.toString() }),
  })
  await note.populate('user', 'name')
  res.status(200).json(note)
})

module.exports = {
  getNotes,
  addNote
}
