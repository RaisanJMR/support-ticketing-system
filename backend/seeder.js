const path = require('path')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const User = require('./models/UserModel')
const Ticket = require('./models/TicketModel')
const Note = require('./models/NoteModel')
const users = require('./data/users.json')

const ticketTemplates = [
  {
    email: 'john@example.com',
    product: 'iPhone',
    description: 'Screen stays black after the latest update.',
    status: 'new',
  },
  {
    email: 'john@example.com',
    product: 'AirTag',
    description: 'AirTag is not ringing from the Find My app.',
    status: 'open',
  },
  {
    email: 'jane@example.com',
    product: 'Macbook Pro',
    description: 'Battery drains from 100% to 20% in under two hours.',
    status: 'open',
  },
  {
    email: 'sarah@example.com',
    product: 'iPad',
    description: 'Apple Pencil disconnects every few minutes.',
    status: 'new',
  },
  {
    email: 'sarah@example.com',
    product: 'iMac',
    description: 'Fans run at full speed while the machine is idle.',
    status: 'closed',
  },
]

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to the root .env file.')
  }
  const conn = await mongoose.connect(process.env.MONGO_URI)
  console.log(`MongoDB connected: ${conn.connection.host}`)
}

const importData = async () => {
  await connectDB()

  await Note.deleteMany()
  await Ticket.deleteMany()
  await User.deleteMany()

  const createdUsers = await User.insertMany(
    await Promise.all(
      users.map(async (user) => ({
        name: user.name,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        isAdmin: Boolean(user.isadmin),
      }))
    )
  )

  const userByEmail = Object.fromEntries(
    createdUsers.map((user) => [user.email, user])
  )
  const staff = createdUsers.find((user) => user.isAdmin)

  const createdTickets = await Ticket.insertMany(
    ticketTemplates.map((ticket) => ({
      user: userByEmail[ticket.email]._id,
      product: ticket.product,
      description: ticket.description,
      status: ticket.status,
    }))
  )

  const ticketByDescription = Object.fromEntries(
    createdTickets.map((ticket) => [ticket.description, ticket])
  )

  const batteryTicket =
    ticketByDescription[
      'Battery drains from 100% to 20% in under two hours.'
    ]
  const fanTicket =
    ticketByDescription['Fans run at full speed while the machine is idle.']

  await Note.insertMany([
    {
      user: userByEmail['jane@example.com']._id,
      ticket: batteryTicket._id,
      text: 'It started after I left it plugged in overnight.',
      isStaff: false,
    },
    {
      user: staff._id,
      ticket: batteryTicket._id,
      text: 'Please try an SMC reset and tell us the cycle count.',
      isStaff: true,
      staffId: staff._id.toString(),
    },
    {
      user: userByEmail['sarah@example.com']._id,
      ticket: fanTicket._id,
      text: 'Resetting the SMC fixed it. Closing this ticket.',
      isStaff: false,
    },
  ])

  console.log(
    `Seeded ${createdUsers.length} users, ${createdTickets.length} tickets, 3 notes`
  )
  console.log('Login password for every seeded user: 123456')
  process.exit(0)
}

importData().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
