'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, Shield, Users, Star, ChevronRight } from 'lucide-react'

const vipCards = [
  {
    title: "Today's VIP Market Bias",
    icon: <Shield size={20} />,
    preview: "BTC structure suggests...",
    tags: ["LIVE", "Daily"],
  },
  {
    title: "Institutional Mindset Notes",
    icon: <Star size={20} />,
    preview: "Smart money positioning...",
    tags: ["WEEKLY", "Analysis"],
  },
  {
    title: "High Probability Scenarios",
    icon: <ChevronRight size={20} />,
    preview: "3 setups with 85%+...",
    tags: ["SETUPS", "Today"],
  },
  {
    title: "Common Retail Mistakes Today",
    icon: <Lock size={20} />,
    preview: "Most traders are making...",
    tags: ["EDUCATION", "Live"],
  },
]

const testimonial = {
  text: "This isn't a signal group. This is trading education that actually works. My understanding of markets completely changed within 30 days.",
  author: "Elite Member — 14 months",
}

function VIPCard({ card, index }: { card: typeof vipCards[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="relative group overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-b from-white/5 to-white/[0.02] hover:border-gold/40 transition-all duration-500"
      style={{
        boxShadow: '0 0 30px rgba(201,168,76,0.05)',
      }}
    >
      {/* Top row */}
      <div className="relative p-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gold">
            {card.icon}
            <span className="text-xs font-medium tracking-wider uppercase text-gold/80">{card.title}</span>
          </div>
          <div className="flex gap-1">
            {card.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-gold/30 text-gold/60 tracking-wider uppercase">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Blurred content */}
        <div className="relative mt-4">
          <div className="space-y-2">
            <div className="h-2.5 bg-white/10 rounded-full w-full" />
            <div className="h-2.5 bg-white/10 rounded-full w-4/5" />
            <div className="h-2.5 bg-white/10 rounded-full w-3/4" />
            <div className="h-2.5 bg-white/10 rounded-full w-5/6" />
            <div className="h-2.5 bg-white/10 rounded-full w-2/3" />
          </div>

          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-[6px] rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-black/40">
                <Lock size={16} className="text-gold" />
              </div>
              <span className="text-xs text-gold/60 tracking-wider uppercase font-medium">Members Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{ boxShadow: 'inset 0 0 30px rgba(201,168,76,0.08)' }}
      />
    </motion.div>
  )
}

export default function VIPSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' })
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  return (
    <section id="vip" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0a04] to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/3 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-gold/20 bg-gold/5"
          >
            <Shield size={14} className="text-gold" />
            <span className="text-xs tracking-[0.25em] uppercase text-gold/80 font-medium">Exclusive Access</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4"
          >
            <span className="gradient-text-gold">10x Limitless</span>
            <br />
            <span className="text-offwhite text-3xl md:text-4xl font-medium">The Inner Circle</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-silver/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Where serious traders separate from the noise.
            Real intelligence, institutional thinking, daily bias.
          </motion.p>

          {/* Member count */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-[10px] text-gold font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-silver/70">
              <Users size={14} className="text-gold" />
              <span><span className="text-gold font-semibold">920+</span> Elite Members</span>
            </div>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {vipCards.map((card, i) => (
            <VIPCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-xl p-6 md:p-8 mb-10 border border-gold/10"
        >
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-gold text-gold" />
            ))}
          </div>
          <p className="text-silver/80 italic text-base md:text-lg leading-relaxed mb-3">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <p className="text-gold/60 text-sm font-medium">{testimonial.author}</p>
        </motion.div>

        {/* CTA */}
        <div ref={ctaRef} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a
              href="#"
              className="group relative inline-flex items-center gap-3 px-10 py-4 overflow-hidden rounded-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                border: '1px solid rgba(201,168,76,0.4)',
              }}
            >
              <span className="relative z-10 text-gold font-semibold tracking-wider uppercase text-sm">
                Apply For VIP Access
              </span>
              <ChevronRight size={16} className="relative z-10 text-gold group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08))' }}
              />
            </a>
            <p className="mt-4 text-silver/40 text-xs tracking-wider uppercase">
              Serious traders only &middot; Limited spots
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
