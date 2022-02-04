const express = require('express')
const {
  getTickets,
  createTickets,
  getSingleTicket,
  deleteTicket,
  updateTicket,
} = require('../controllers/ticketController')
const router = express.Router()


const { protect } = require('../middleware/authMiddleware')

const noteRouter = require('./noteRoutes')

router.use('/:ticketId/notes', noteRouter)


router.route('/').get(protect, getTickets).post(protect, createTickets)

router
  .route('/:id')
  .get(protect, getSingleTicket)
  .delete(protect, deleteTicket)
  .put(protect, updateTicket)
module.exports = router
