const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel')
const Ticket = require('../models/TicketModel')

// @desc Get user Tickets
// @route GET /api/tickets
// @access Private

const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const tickets = req.user.isAdmin
    ? await Ticket.find().populate('user', 'name email')
    : await Ticket.find({ user: req.user.id })
  res.status(200).json(tickets)
})

// @desc Get single Ticket
// @route GET /api/tickets/:id
// @access Private

const getSingleTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }
  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(403)
    throw new Error('Not authorized')
  }
  if (req.user.isAdmin) {
    await ticket.populate('user', 'name email')
  }
  res.status(200).json(ticket)
})

// @desc create Tickets
// @route POST /api/tickets
// @access Private

const createTickets = asyncHandler(async (req, res) => {
  const { product, description } = req.body
  if (!product || !description) {
    res.status(400)
    throw new Error('Please add a product and a description')
  }
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'new',
  })
  res.status(201).json(ticket)
})


// @desc delete Tickets
// @route DELETE /api/tickets/:id
// @access Private

const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }
  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }
  if (ticket.user.toString() !== req.user.id) {
    res.status(404)
    throw new Error('Not Authorized')
  }
  await ticket.remove()

  res.status(200).json({ success: 'true' })
})


// @desc update Ticket
// @route PUT /api/tickets/:id
// @access Private

const updateTicket = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const isOwner = ticket.user.toString() === req.user.id
  if (!isOwner && !req.user.isAdmin) {
    res.status(403)
    throw new Error('Not authorized')
  }

  const { status } = req.body
  const allowedStatuses = ['new', 'open', 'closed']
  if (!allowedStatuses.includes(status)) {
    res.status(400)
    throw new Error('Please provide a valid status')
  }
  if (isOwner && !req.user.isAdmin && status !== 'closed') {
    res.status(403)
    throw new Error('Not authorized to set this status')
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
  if (req.user.isAdmin) {
    await updatedTicket.populate('user', 'name email')
  }

  res.status(200).json(updatedTicket)

})

module.exports = {
  getTickets,
  getSingleTicket,
  createTickets,
  deleteTicket,
  updateTicket,
}
