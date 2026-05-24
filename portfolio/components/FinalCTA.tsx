'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, ExternalLink, Mail, ArrowRight } from 'lucide-react'

const lines = [
  "Build the System.",
  "Master the Mind.",
  "Leave a Legacy.",
]

const socialLinks = [
  {
    label: "Telegram",
    href: "https://t.me/OsmaanMooraby",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/OsmaanMooraby",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/OsmaanMooraby",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
]

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Cinematic background */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.12) 0%, rgba(16,185,129,0.04) 40%, #050505 70%)',
        }}
      />

      {/* Animated gradient rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-gold/10"
          style={{
            width: `${400 + i * 200}px`,
            height: `${400 + i * 200}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}

      {/* Top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Main headline */}
        <div className="mb-10">
          {lines.map((line, i) => (
            <motion.h2
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight"
            >
              {i === 0 && <span className="gradient-text-gold text-shadow-gold">{line}</span>}
              {i === 1 && <span className="text-offwhite">{line}</span>}
              {i === 2 && (
                <span
                  className="gradient-text-gold"
                  style={{ opacity: 0.9 }}
                >
                  {line}
                </span>
              )}
            </motion.h2>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-silver/60 text-base md:text-lg mb-12 max-w-lg mx-auto font-serif italic"
        >
          The journey of 10,000x starts with a single decision.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <a
            href="https://t.me/OsmaanMooraby"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-gradient-to-r from-gold to-gold-mid text-background font-semibold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold/25 min-w-[200px] justify-center"
          >
            <span className="relative z-10">Join 10x Limitless</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <a
            href="#story"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-sm border border-gold/30 text-gold font-medium text-sm tracking-wider uppercase hover:border-gold/60 hover:bg-gold/5 transition-all duration-300 min-w-[200px] justify-center"
          >
            Explore My Work
            <ExternalLink size={14} className="group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="mailto:osmaan@10xlimitless.com"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-sm border border-silver/20 text-silver/70 font-medium text-sm tracking-wider uppercase hover:border-silver/40 hover:text-silver hover:bg-white/3 transition-all duration-300 min-w-[200px] justify-center"
          >
            Contact Osmaan
            <Mail size={14} className="group-hover:scale-110 transition-transform" />
          </a>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 1.3 }}
          className="w-full max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8"
        />

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-full border border-silver/15 flex items-center justify-center text-silver/40 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300"
            >
              {link.icon}
            </a>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-silver/25 text-xs tracking-widest uppercase"
        >
          © 2024 Osmaan Mooraby &middot; All Rights Reserved &middot; Built with Vision
        </motion.p>
      </div>
    </section>
  )
}
