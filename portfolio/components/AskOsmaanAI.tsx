'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot } from 'lucide-react'

const prompts = [
  {
    question: "How does Osmaan analyze markets?",
    answer: "I analyze markets through multi-timeframe confluence — starting with the weekly trend, then daily structure, then 4H entry zones. EMA alignment (20/50/200) tells me whether the market is in distribution or accumulation. I combine that with liquidation mapping and institutional order flow patterns. Technical analysis alone is noise — context is everything.",
  },
  {
    question: "What mindset mistakes keep traders poor?",
    answer: "The number one mistake? Revenge trading. After a loss, the ego wants to recover immediately. That's when the account bleeds fastest. Poor traders trade their emotions. Elite traders trade their systems. The gap between them isn't knowledge — it's discipline under extreme pressure. Most traders already know what to do. They just can't do it when it matters.",
  },
  {
    question: "How should beginners start crypto?",
    answer: "Start by learning, not earning. Spend 90 days studying without risking real money. Understand market structure: higher highs, lower lows, liquidity sweeps. Learn risk management before any strategy. Most beginners focus obsessively on entry points when the real edge is how you manage the trade after entry. Protect capital first. Profit follows.",
  },
  {
    question: "What does wealth mean beyond money?",
    answer: "Wealth beyond money is optionality — the freedom to choose your time, your environment, your energy. True wealth is building something that runs without you. It's having enough that the fear of losing it no longer controls your decisions. Real wealth is inner peace. A man at peace with Allah, with himself, and with his purpose — that man is wealthy regardless of his balance.",
  },
]

interface Message {
  role: 'user' | 'ai'
  content: string
  id: number
}

function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, 12)
    return () => clearInterval(interval)
  }, [text, onComplete])

  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 animate-pulse" />}
    </span>
  )
}

export default function AskOsmaanAI() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Welcome. I am trained on years of markets, mindset, and mastery. Ask me anything about trading, wealth, psychology, or the path to building a meaningful life.",
      id: 0,
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTypingId, setActiveTypingId] = useState<number | null>(null)
  const counterRef = useRef(1)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handlePrompt = (prompt: typeof prompts[0]) => {
    if (isTyping) return

    const userMsgId = counterRef.current++
    const aiMsgId = counterRef.current++

    setMessages(prev => [...prev, {
      role: 'user',
      content: prompt.question,
      id: userMsgId,
    }])

    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: prompt.answer,
        id: aiMsgId,
      }])
      setActiveTypingId(aiMsgId)
    }, 800)
  }

  const handleTypingComplete = (id: number) => {
    if (id === activeTypingId) {
      setIsTyping(false)
      setActiveTypingId(null)
    }
  }

  return (
    <section id="ai" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080a08] to-black" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-emerald/4 blur-[120px]" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gold/4 blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-emerald/30 bg-emerald/5"
          >
            <Sparkles size={14} className="text-emerald" />
            <span className="text-xs tracking-[0.2em] uppercase text-emerald/80 font-medium">AI Intelligence</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            <span className="text-offwhite">Ask </span>
            <span className="gradient-text-gold">Osmaan AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-silver/60 text-base"
          >
            Intelligence trained on years of markets, mindset, and mastery
          </motion.p>
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="rounded-2xl overflow-hidden border border-gold/15"
          style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Chat header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gold/10 bg-black/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs text-emerald/70 font-medium">Osmaan AI — Online</span>
            </div>
            <span className="text-[10px] text-silver/30 tracking-wider uppercase">10x Intelligence</span>
          </div>

          {/* Messages */}
          <div className="h-72 md:h-80 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gold/20">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    msg.role === 'ai'
                      ? 'bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30'
                      : 'bg-gradient-to-br from-silver/20 to-silver/5 border border-silver/20'
                  }`}>
                    {msg.role === 'ai'
                      ? <Bot size={14} className="text-gold" />
                      : <User size={14} className="text-silver" />
                    }
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'ai'
                        ? 'bg-white/5 border border-white/8 text-silver/90 rounded-tl-sm'
                        : 'bg-gold/10 border border-gold/20 text-offwhite rounded-tr-sm'
                    }`}
                  >
                    {msg.role === 'ai' && msg.id === activeTypingId ? (
                      <TypingText text={msg.content} onComplete={() => handleTypingComplete(msg.id)} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isTyping && activeTypingId === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center">
                  <Bot size={14} className="text-gold" />
                </div>
                <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gold/50"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips */}
          <div className="px-5 py-4 border-t border-gold/10 space-y-3">
            <p className="text-xs text-silver/40 tracking-wider uppercase font-medium">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handlePrompt(p)}
                  disabled={isTyping}
                  className="text-xs px-3 py-1.5 rounded-full border border-gold/25 text-gold/70 hover:border-gold/50 hover:text-gold hover:bg-gold/5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {p.question}
                </button>
              ))}
            </div>

            {/* Input row (visual only) */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
              <div className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-silver/30 border border-white/8">
                Ask about trading, mindset, or wealth building...
              </div>
              <button className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center hover:bg-gold/30 transition-colors">
                <Send size={14} className="text-gold" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-2 border-t border-white/5 bg-black/20">
            <p className="text-[10px] text-silver/25 text-center tracking-wider">
              Powered by 10x Limitless Intelligence &middot; Not financial advice
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
