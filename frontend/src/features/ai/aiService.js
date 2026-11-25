import axios from 'axios'

const API_URL = '/api/ai/'

const chat = async ({ message, history }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(
    `${API_URL}chat`,
    { message, history },
    config
  )
  return response.data
}

const aiService = {
  chat,
}

export default aiService
