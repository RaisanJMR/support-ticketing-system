const TICKET_TOOLS = [
  {
    type: 'function',
    name: 'listTickets',
    description:
      'List support tickets from the database. Use this before summarizing open, closed, or new tickets. Optionally filter by status and/or product.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['new', 'open', 'closed'],
          description: 'Filter by ticket status',
        },
        product: {
          type: 'string',
          enum: ['iPhone', 'iPad', 'Macbook Pro', 'iMac', 'AirTag'],
          description: 'Filter by product',
        },
        limit: {
          type: 'number',
          description: 'Max tickets to return (default 30, max 50)',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'countTickets',
    description:
      'Count tickets, optionally filtered by status. Use for quick totals like how many are open or closed.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['new', 'open', 'closed'],
          description: 'If set, count only this status',
        },
      },
    },
  },
  {
    type: 'function',
    name: 'getTicket',
    description:
      'Get one ticket by id, including its notes. Use when the admin asks about a specific ticket.',
    parameters: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'string',
          description: 'MongoDB ticket id',
        },
      },
      required: ['ticketId'],
    },
  },
]

module.exports = { TICKET_TOOLS }
