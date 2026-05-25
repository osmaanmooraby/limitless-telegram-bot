'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Lock, FileText, TrendingUp, BookOpen, Users, ChevronRight, KeyRound } from 'lucide-react'

const vaultItems = [
  {
    title: "Private Market Reports",
    icon: <FileText size={20} />,
    description: "Weekly deep-dive institutional analysis not published anywhere publicly.",
    lines: [5, 4, 5, 3],
  },
  {
    title: "Institutional Flow Analysis",
    icon: <TrendingUp size={20} />,
    description: "Track where the real money is moving before price confirms the trend.",
    lines: [4, 5, 4, 3],
  },
  {
    title: "The Osmaan Playbook",
    icon: <BookOpen size={20} />,
    description: "The complete documented system — entries, exits, risk rules, and mental frameworks.",
    lines: [5, 5, 4, 4],
  },
  {
    title: "Founder's Inner Circle",
    icon: <Users size={20} />,
    description: "Direct access. Real conversations. A table for those building something that matters.",
    lines: [3, 5, 4, 3],
  },
]

function VaultCard({ item, index }: { item: typeof vaultItems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      className="relative group rounded-2xl border border-gold/20 p-6 overflow-hidden hover:border-gold/35 transition-all duration-500"
      style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.04), rgba(0,0,0,0.6))',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
          {item.icon}
        </div>
        <h4 className="text-sm font-semibold text-offwhite group-hover:text-gold transition-colors duration-300">
          {item.title}
        </h4>
      </div>

      {/* Blurred line content */}
      <div className="relative mb-4 space-y-2">
        {item.lines.map((width, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-white/8"
            style={{ width: `${width * 20}%` }}
          />
        ))}

        {/* Blur overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <Lock size={18} className="text-gold/50" />
            <span className="text-[10px] text-gold/40 tracking-wider uppercase font-medium">Restricted</span>
          </div>
        </div>
      </div>

      <p className="text-silver/40 text-xs leading-relaxed">{item.description}</p>

      {/* Subtle glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 40px rgba(201,168,76,0.06)' }}
      />
    </motion.div>
  )
}

export default function HiddenVault() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const [showRequest, setShowRequest] = useState(false)

  return (
    <section id="vault" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%), #050505',
        }}
      />

      {/* Top glow bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 15px rgba(201,168,76,0.2)', '0 0 40px rgba(201,168,76,0.4)', '0 0 15px rgba(201,168,76,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center"
            >
              <Lock size={28} className="text-gold" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold gradient-text-gold mb-4"
          >
            The Vault
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-silver/60 text-lg md:text-xl font-serif italic mb-3"
          >
            For serious minds only.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-silver/40 text-sm max-w-lg mx-auto leading-relaxed"
          >
            Some knowledge isn't meant for everyone. The Vault contains advanced frameworks,
            private market analysis, and exclusive access to thinking most will never encounter.
          </motion.p>
        </div>

        {/* Vault cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {vaultItems.map((item, i) => (
            <VaultCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={() => setShowRequest(!showRequest)}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-sm overflow-hidden border border-gold/30 transition-all duration-300 hover:border-gold/50"
            style={{ background: 'rgba(201,168,76,0.06)' }}
          >
            <KeyRound size={16} className="text-gold" />
            <span className="text-gold text-sm font-medium tracking-wider uppercase">Request Access</span>
            <ChevronRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(201,168,76,0.1)' }}
            />
          </button>

          <AnimatePresence>
            {showRequest && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mt-6 max-w-md mx-auto"
              >
                <div className="glass-card rounded-xl p-5 border border-gold/20">
                  <p className="text-silver/60 text-sm leading-relaxed mb-4">
                    Vault access is granted individually. Reach out via Telegram or email
                    with your background and intention.
                  </p>
                  <a
                    href="https://t.me/OsmaanMooraby"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    Contact on Telegram <ChevronRight size={14} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
