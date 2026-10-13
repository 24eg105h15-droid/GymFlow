import { useMemo, useState } from 'react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { getChatbotReply } from '../utils/fitness.js'

export default function ChatbotPanel({ user }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! Ask me about calories, protein, macros, fiber, hydration, meals, or workout progression.',
    },
  ])

  const suggestions = useMemo(
    () => [
      'Estimate my maintenance calories',
      'How much protein should I eat?',
      'Explain my daily macros',
      'What should I eat before training?',
    ],
    [],
  )

  function handleSend(messageText) {
    const trimmed = (messageText || '').trim()
    if (!trimmed) return

    setMessages((current) => [...current, { sender: 'user', text: trimmed }])
    setInput('')

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { sender: 'bot', text: getChatbotReply(trimmed, user) },
      ])
    }, 180)
  }

  return (
    <div className="chatbot-shell">
      {open ? (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="eyebrow">GYMFLOW AI</p>
              <h3>Coach</h3>
            </div>
            <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X size={16} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`chatbot-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chatbot-suggestions">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" className="chip-button" onClick={() => handleSend(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>

          <form
            className="chatbot-form"
            onSubmit={(event) => {
              event.preventDefault()
              handleSend(input)
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your coach..."
              aria-label="Ask the fitness coach"
            />
            <button type="submit" className="button button-primary button-small" aria-label="Send message">
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        <button type="button" className="chatbot-toggle" onClick={() => setOpen(true)} aria-label="Open fitness assistant">
          <Sparkles size={18} />
        </button>
      )}
    </div>
  )
}
