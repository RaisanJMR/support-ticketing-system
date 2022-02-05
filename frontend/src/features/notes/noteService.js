import axios from 'axios'
const API_URL = '/api/tickets/'

// Get Ticket notes
const getNotes = async (ticketId, token) => {
  console.log(ticketId)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + ticketId + '/notes', config)
  console.log('ticket response from get ticket', response)
  return response.data
}
// Create Ticket notes
const createNote = async (noteText, ticketId, token) => {
  console.log(ticketId)
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(
    API_URL + ticketId + '/notes',
    { text: noteText },
    config
  )
  console.log('ticket response from get ticket', response)
  return response.data
}

const noteService = {
  getNotes,
  createNote,
}

export default noteService
