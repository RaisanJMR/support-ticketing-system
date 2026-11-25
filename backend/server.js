const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const colors = require('colors')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing. Set it in the Render environment variables.')
  process.exit(1)
}

// Connect to DB
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROUTES
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/ai', require('./routes/aiRoutes'))

// serve front end
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build')
  app.use(express.static(buildPath))

  app.get('*', (req, res) =>
    res.sendFile(path.join(buildPath, 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome to support ticketing system' })
  })
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
