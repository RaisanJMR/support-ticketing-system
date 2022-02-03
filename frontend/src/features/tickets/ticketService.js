import axios from 'axios'
const API_URL = '/api/tickets/'

// Create new Ticket
const createTicket = async (ticketData, token) => {
  console.log(ticketData)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, ticketData, config)
  
  return response.data
}

// Get user Ticket
const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL, config)
 
  return response.data
}

// Get Ticket
const getTicket = async (ticketId, token) => {
  console.log(ticketId)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + ticketId, config)
  console.log('ticket response from get ticket', response)
  return response.data
}

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
}

export default ticketService
