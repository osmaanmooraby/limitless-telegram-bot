'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const chapters = [
  {
    number: '01',
    title: 'The Struggle',
    text: 'Born into a world that wasn\'t built for dreamers. Poverty wasn\'t just financial — it was a mindset imposed by circumstance.',
  },
  {
    number: '02',
    title: 'The Awakening',
    text: 'One moment changed everything. When you see through the illusion of conventional success, you can never unsee it.',
  },
  {
    number: '03',
    title: 'The Trader',
    text: 'Markets became the classroom. Charts revealed human psychology. Every loss was tuition for mastery.',
  },
  {
    number: '04',
    title: 'The Strategist',
    text: 'Trading evolved into systems thinking. Risk management. Capital preservation. Patience over impulse.',
  },
  {
    number: '05',
    title: 'The Builder',
    text: '10x Limitless was born — not as a product but as a movement for those who refuse ordinary outcomes.',
  },
  {
    number: '06',
    title: 'The Legacy',
    text: 'This is only the beginning. Empire chapters are being written. Systems are being built. History is being made.',
  },
]

function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`flex items-center w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
    >
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative w-full md:w-[48%] glass-card rounded-lg p-6 md:p-8 group hover:gold-glow transition-all duration-500"
      >
        {/* Gold number */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute -top-4 left-6 text-5xl md:text-6xl font-serif font-bold gradient-text-gold opacity-30 select-none"
        >
          {chapter.number}
        </motion.span>

        <div className="relative z-10 pt-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl font-serif font-bold text-gold mb-3"
          >
            {chapter.title}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-silver-light/80 leading-relaxed text-sm md:text-base"
          >
            {chapter.text}
          </motion.p>
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent origin-left"
        />
      </motion.div>
    </div>
  )
}

export default function LifeStory() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' })

  return (
    <section id="story" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[150px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-emerald/3 blur-[120px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            Chapter by Chapter
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold gradient-text-gold"
          >
            The Journey
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

          <div className="space-y-12 md:space-y-16">
            {chapters.map((chapter, index) => (
              <ChapterCard key={chapter.number} chapter={chapter} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
