'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Moon, Heart, Star } from 'lucide-react'

const reflections = [
  {
    category: "Qur\'anic Reflection",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    quote: "And whoever relies upon Allah — then He is sufficient for him.",
    source: "Surah At-Talaq 65:3",
    color: "from-gold/10 to-transparent",
    border: "border-gold/20",
    icon: <Star size={16} className="text-gold" />,
  },
  {
    category: "Dhikr Philosophy",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    quote: "In remembrance, the chaos of markets becomes distant noise. The heart that knows Allah is never truly shaken.",
    source: "Surah Ar-Ra'd 13:28",
    color: "from-emerald/10 to-transparent",
    border: "border-emerald/20",
    icon: <Moon size={16} className="text-emerald" />,
  },
  {
    category: "Tawakkul & Struggle",
    arabic: null,
    quote: "True trust in Allah doesn't mean abandoning effort. It means perfecting your effort, then surrendering the outcome with complete peace.",
    source: "Osmaan Mooraby",
    color: "from-silver/5 to-transparent",
    border: "border-silver/15",
    icon: <Heart size={16} className="text-silver" />,
  },
  {
    category: "Wisdom From The Awliya",
    arabic: null,
    quote: "The masters of the heart knew: dunya chases those who run from it, and flees from those who chase it. Presence of heart is worth more than presence of wealth.",
    source: "Classical Sufi Wisdom",
    color: "from-gold/8 to-transparent",
    border: "border-gold/15",
    icon: <Star size={16} className="text-gold/70" />,
  },
  {
    category: "Silent Lessons From Pain",
    arabic: null,
    quote: "Every devastating loss carried a lesson I was too proud to learn gently. Pain became the teacher when comfort had failed. I am grateful for both.",
    source: "Personal Reflection",
    color: "from-emerald/8 to-transparent",
    border: "border-emerald/15",
    icon: <Heart size={16} className="text-emerald/70" />,
  },
  {
    category: "The Balanced Path",
    arabic: null,
    quote: "Wealth pursued with purpose, shared with gratitude, governed by principle — this is the 10x life. Not just rich in account. Rich in character.",
    source: "Osmaan Mooraby",
    color: "from-gold/10 to-transparent",
    border: "border-gold/20",
    icon: <Moon size={16} className="text-gold" />,
  },
]

function ReflectionCard({ item, index }: { item: typeof reflections[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.15 }}
      className={`relative rounded-2xl p-6 md:p-8 border ${item.border} overflow-hidden group hover:border-gold/30 transition-all duration-500`}
      style={{
        background: `linear-gradient(135deg, ${item.color.includes('gold') ? 'rgba(201,168,76,0.05)' : item.color.includes('emerald') ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)'}, transparent)`,
      }}
    >
      {/* Decorative corner ornament */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <path d="M80 0 L80 80 L0 80" stroke="currentColor" strokeWidth="1" fill="none" className="text-gold" />
          <path d="M60 0 L80 20" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gold" />
          <path d="M80 40 L40 80" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gold" />
        </svg>
      </div>

      {/* Category tag */}
      <div className="flex items-center gap-2 mb-4">
        {item.icon}
        <span className="text-xs tracking-[0.2em] uppercase text-silver/50 font-medium">{item.category}</span>
      </div>

      {/* Arabic text */}
      {item.arabic && (
        <div className="mb-4 text-right">
          <p className="text-xl md:text-2xl text-gold/60 leading-relaxed font-serif" dir="rtl">
            {item.arabic}
          </p>
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-silver/80 text-sm md:text-base leading-relaxed mb-4 italic font-serif">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      {/* Source */}
      <p className="text-gold/50 text-xs tracking-wider font-medium">— {item.source}</p>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
        style={{ boxShadow: 'inset 0 0 40px rgba(201,168,76,0.04)' }}
      />
    </motion.div>
  )
}

export default function InnerWorld() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="inner" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background — very subtle and calm */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 70%), #0a0a0a',
        }}
      />

      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Crescent decoration */}
      <div className="absolute top-12 right-8 md:right-16 opacity-5">
        <Moon size={80} className="text-gold" />
      </div>
      <div className="absolute bottom-12 left-8 md:left-16 opacity-5">
        <Star size={60} className="text-gold" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-8 h-[1px] bg-gold/40" />
            <Moon size={14} className="text-gold/60" />
            <div className="w-8 h-[1px] bg-gold/40" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-offwhite mb-4"
          >
            The{' '}
            <span className="gradient-text-gold">Inner World</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-silver/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed font-serif italic"
          >
            The foundation beneath the strategy. The silence beneath the signal.
            The faith that makes the system possible.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reflections.map((item, i) => (
            <ReflectionCard key={item.category} item={item} index={i} />
          ))}
        </div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="flex items-center justify-center gap-4 mt-16"
        >
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
          <div className="w-2 h-2 rounded-full bg-gold/40" />
          <div className="w-2 h-2 rounded-full bg-gold/20" />
          <div className="w-2 h-2 rounded-full bg-gold/40" />
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
        </motion.div>
      </div>
    </section>
  )
}
