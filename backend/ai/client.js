const { GoogleGenAI } = require('@google/genai')

let client

function getAI() {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  }
  return client
}

// Prefer lighter / alternate models when one is overloaded
const MODEL_CANDIDATES = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-4-argon',
  'gemini-4-carbon',
  'gemini-4-neon',
  'gemini-2.5-flash',
]

module.exports = { getAI, MODEL_CANDIDATES }
