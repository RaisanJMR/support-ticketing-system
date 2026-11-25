import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { IoArrowUp, IoSparklesOutline } from 'react-icons/io5'
import AiMessageContent from '../components/AiMessageContent'
import aiService from '../features/ai/aiService'
import { getInitials } from '../utils/format'

const SUGGESTIONS = [
  'Summarize open tickets',
  'Summarize closed tickets',
]

function AiChat() {
  const { user } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, sending])

  if (!user?.isAdmin) {
    return <Navigate to='/' replace />
  }

  const canSend = Boolean(input.trim()) && !sending
  const showEmpty = messages.length === 0 && !sending

  const sendMessage = async (rawText) => {
    const text = rawText.trim()
    if (!text || sending) return

    const history = messages
      .filter((m) => !m.isError)
      .map(({ role, text: body }) => ({
        role,
        text: body,
      }))

    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const data = await aiService.chat(
        { message: text, history },
        user.token
      )
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.text || 'No response returned.',
        },
      ])
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to get AI response'
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: message,
          isError: true,
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend) sendMessage(input)
    }
  }

  return (
    <div className='ai-chat'>
      <header className='ai-chat-toolbar'>
        <div className='ai-chat-toolbar-text'>
          <h1 className='ai-chat-title'>AI Assist</h1>
          <p className='ai-chat-subtitle'>Staff ticket summaries</p>
        </div>
      </header>

      <div className='ai-chat-thread' ref={listRef}>
        {showEmpty ? (
          <div className='ai-chat-empty'>
            <span className='ai-chat-empty-icon' aria-hidden='true'>
              <IoSparklesOutline />
            </span>
            <h2 className='ai-chat-empty-title'>What can I help with?</h2>
            <p className='ai-chat-empty-text'>
              Ask me to summarize open or closed tickets from the support desk.
            </p>
            <div className='ai-chat-suggestions'>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type='button'
                  className='ai-chat-suggestion'
                  onClick={() => sendMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className='ai-chat-messages' role='log' aria-live='polite'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-chat-row ai-chat-row-${message.role}${
                  message.isError ? ' ai-chat-row-error' : ''
                }`}>
                {message.role === 'assistant' ? (
                  <span
                    className='ai-chat-avatar ai-chat-avatar-ai'
                    aria-hidden='true'>
                    <IoSparklesOutline />
                  </span>
                ) : (
                  <span className='ai-chat-avatar' aria-hidden='true'>
                    {getInitials(user?.name)}
                  </span>
                )}
                <div className='ai-chat-bubble'>
                  <p className='visually-hidden'>
                    {message.role === 'assistant' ? 'AI' : 'You'}
                  </p>
                  <div
                    className={`ai-chat-text${
                      message.isError ? ' ai-chat-text-error' : ''
                    }`}>
                    {message.role === 'assistant' ? (
                      <AiMessageContent
                        text={message.text}
                        isError={message.isError}
                      />
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className='ai-chat-row ai-chat-row-assistant'>
                <span
                  className='ai-chat-avatar ai-chat-avatar-ai'
                  aria-hidden='true'>
                  <IoSparklesOutline />
                </span>
                <div className='ai-chat-bubble'>
                  <p className='visually-hidden'>AI</p>
                  <div className='ai-chat-typing' aria-label='AI is typing'>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='ai-chat-footer'>
        <form className='ai-chat-composer' onSubmit={onSubmit}>
          <label htmlFor='ai-chat-input' className='visually-hidden'>
            Message
          </label>
          <textarea
            id='ai-chat-input'
            ref={inputRef}
            className='ai-chat-input'
            rows={1}
            placeholder='Message AI…'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={sending}
          />
          <button
            type='submit'
            className='ai-chat-send'
            disabled={!canSend}
            aria-label='Send message'>
            <IoArrowUp aria-hidden='true' />
          </button>
        </form>
        <p className='ai-chat-disclaimer'>
          Generated by AI. Verify important details before acting.
        </p>
      </div>
    </div>
  )
}

export default AiChat
