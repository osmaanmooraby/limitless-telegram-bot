'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Play, TrendingUp, Brain, BookOpen, Eye, Moon } from 'lucide-react'

type Category = 'All' | 'Trading' | 'Psychology' | 'Philosophy' | 'Spirituality'

const categories: { label: Category; icon: React.ReactNode }[] = [
  { label: 'All', icon: null },
  { label: 'Trading', icon: <TrendingUp size={14} /> },
  { label: 'Psychology', icon: <Brain size={14} /> },
  { label: 'Philosophy', icon: <BookOpen size={14} /> },
  { label: 'Spirituality', icon: <Moon size={14} /> },
]

const mediaCards = [
  {
    title: "Why 95% of Traders Fail",
    category: 'Trading' as Category,
    duration: "24 min",
    gradient: "from-[#1a0a00] to-[#2d1500]",
    iconBg: "bg-orange-500/20",
    icon: <TrendingUp className="text-orange-400" size={24} />,
    description: "A deep dive into the psychological and technical reasons most traders never find consistency.",
    views: "12.4K",
  },
  {
    title: "The Psychology of Losing",
    category: 'Psychology' as Category,
    duration: "18 min",
    gradient: "from-[#0a0018] to-[#180030]",
    iconBg: "bg-purple-500/20",
    icon: <Brain className="text-purple-400" size={24} />,
    description: "How your brain is wired against you in the markets — and how to rewire it.",
    views: "8.9K",
  },
  {
    title: "Reading Market Manipulation",
    category: 'Trading' as Category,
    duration: "31 min",
    gradient: "from-[#001a0a] to-[#003018]",
    iconBg: "bg-emerald-500/20",
    icon: <Eye className="text-emerald-400" size={24} />,
    description: "How institutions move price to hunt retail liquidity before the real move begins.",
    views: "21.7K",
  },
  {
    title: "Wealth vs Money — The Real Difference",
    category: 'Philosophy' as Category,
    duration: "15 min",
    gradient: "from-[#1a1400] to-[#2d2200]",
    iconBg: "bg-gold/20",
    icon: <BookOpen className="text-gold" size={24} />,
    description: "Why chasing money is the surest path to poverty — and what real wealth actually looks like.",
    views: "15.2K",
  },
  {
    title: "Patience as a Trading Edge",
    category: 'Psychology' as Category,
    duration: "20 min",
    gradient: "from-[#0a0014] to-[#18002a]",
    iconBg: "bg-violet-500/20",
    icon: <Brain className="text-violet-400" size={24} />,
    description: "The most underestimated edge in markets isn't a system. It's the ability to wait.",
    views: "9.1K",
  },
  {
    title: "EMA Strategy Masterclass",
    category: 'Trading' as Category,
    duration: "45 min",
    gradient: "from-[#001518] to-[#003040]",
    iconBg: "bg-cyan-500/20",
    icon: <TrendingUp className="text-cyan-400" size={24} />,
    description: "Complete guide to multi-timeframe EMA confluence for high-probability trade entries.",
    views: "34.5K",
  },
  {
    title: "The Broke Mindset Blueprint",
    category: 'Psychology' as Category,
    duration: "22 min",
    gradient: "from-[#180000] to-[#300000]",
    iconBg: "bg-red-500/20",
    icon: <Brain className="text-red-400" size={24} />,
    description: "12 mental models that keep people financially stuck — and how to break each one.",
    views: "18.3K",
  },
  {
    title: "Sufi Lessons on Detachment",
    category: 'Spirituality' as Category,
    duration: "16 min",
    gradient: "from-[#001418] to-[#002530]",
    iconBg: "bg-teal-500/20",
    icon: <Moon className="text-teal-400" size={24} />,
    description: "Ancient wisdom from the Awliya on releasing attachment to outcomes — pure gold for traders.",
    views: "7.6K",
  },
  {
    title: "How Institutions Hunt Stop Losses",
    category: 'Trading' as Category,
    duration: "28 min",
    gradient: "from-[#0d0000] to-[#1a0808]",
    iconBg: "bg-rose-500/20",
    icon: <Eye className="text-rose-400" size={24} />,
    description: "The exact mechanism by which smart money creates false breakouts to fill their orders.",
    views: "29.8K",
  },
  {
    title: "Building Discipline Like a Surgeon",
    category: 'Psychology' as Category,
    duration: "19 min",
    gradient: "from-[#001800] to-[#002a00]",
    iconBg: "bg-green-500/20",
    icon: <Brain className="text-green-400" size={24} />,
    description: "The three daily practices that separate elite performers from everyone else.",
    views: "11.0K",
  },
  {
    title: "Risk Management Secrets",
    category: 'Trading' as Category,
    duration: "35 min",
    gradient: "from-[#0a0a00] to-[#1a1800]",
    iconBg: "bg-yellow-500/20",
    icon: <TrendingUp className="text-yellow-400" size={24} />,
    description: "How to size positions, set stops, and protect capital like a professional fund manager.",
    views: "22.1K",
  },
  {
    title: "Inner Peace in Volatile Markets",
    category: 'Spirituality' as Category,
    duration: "14 min",
    gradient: "from-[#000e18] to-[#001c30]",
    iconBg: "bg-sky-500/20",
    icon: <Moon className="text-sky-400" size={24} />,
    description: "Tawakkul in practice — how faith creates the emotional foundation for clear market decisions.",
    views: "6.4K",
  },
]

function MediaCard({ card, index }: { card: typeof mediaCards[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03, zIndex: 10 }}
    >
      {/* Thumbnail */}
      <div className={`relative h-48 bg-gradient-to-br ${card.gradient} overflow-hidden`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-14 h-14 rounded-full ${card.iconBg} flex items-center justify-center backdrop-blur-sm border border-white/10`}>
            {card.icon}
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-xs text-silver/80 font-medium">
          {card.duration}
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center"
              >
                <Play size={20} className="text-gold ml-1" fill="currentColor" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="glass-card p-4 border-t border-gold/10">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-offwhite leading-snug group-hover:text-gold transition-colors duration-300">
            {card.title}
          </h4>
        </div>
        <p className="text-silver/50 text-xs leading-relaxed line-clamp-2 mb-3">
          {card.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/20 text-gold/60 tracking-wider uppercase">
            {card.category}
          </span>
          <span className="text-xs text-silver/40 flex items-center gap-1">
            <Eye size={10} /> {card.views}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function MediaHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  const filtered = activeCategory === 'All'
    ? mediaCards
    : mediaCards.filter(c => c.category === activeCategory)

  return (
    <section id="media" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-emerald/3 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Knowledge Library
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold gradient-text-gold mb-4"
          >
            Wealth Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-silver/60 text-base md:text-lg"
          >
            Education that compounds as fast as good capital
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.label
                  ? 'bg-gold text-background border border-gold'
                  : 'border border-gold/20 text-silver/60 hover:border-gold/40 hover:text-silver bg-transparent'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((card, i) => (
              <MediaCard key={card.title} card={card} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
