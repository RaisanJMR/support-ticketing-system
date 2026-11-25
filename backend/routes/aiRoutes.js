const express = require('express')
const router = express.Router()
const { chat } = require('../controllers/aiController')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/chat', protect, admin, chat)

module.exports = router
