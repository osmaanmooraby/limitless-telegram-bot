'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plane, Building2, Radio, Heart, Sun, UtensilsCrossed, GraduationCap, Globe, ShoppingCart, Tv, Car, HandHeart, X } from 'lucide-react'

const sectors = [
  {
    id: 'airline',
    name: 'Airline',
    icon: <Plane size={28} />,
    phase: 'Phase 5',
    color: 'from-sky-500/20 to-sky-900/10',
    borderColor: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    vision: 'Connecting cities, empowering mobility — owned and operated on Islamic financial principles. No interest. No compromise. Pure movement.',
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: <Building2 size={28} />,
    phase: 'Phase 2',
    color: 'from-gold/20 to-gold/5',
    borderColor: 'border-gold/30',
    iconColor: 'text-gold',
    vision: 'Property portfolios built on halal capital, generating generational wealth that outlives the builder and funds generations of purpose.',
  },
  {
    id: 'telecom',
    name: 'Telecom',
    icon: <Radio size={28} />,
    phase: 'Phase 4',
    color: 'from-violet-500/20 to-violet-900/10',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-400',
    vision: 'Connecting communities with affordable, ethical connectivity solutions. Access to knowledge is a right, not a luxury.',
  },
  {
    id: 'hospital',
    name: 'Hospital',
    icon: <Heart size={28} />,
    phase: 'Phase 3',
    color: 'from-rose-500/20 to-rose-900/10',
    borderColor: 'border-rose-500/30',
    iconColor: 'text-rose-400',
    vision: 'Healthcare should never be a privilege. Building accessible, world-class facilities where no one is turned away for lack of funds.',
  },
  {
    id: 'solar',
    name: 'Solar Energy',
    icon: <Sun size={28} />,
    phase: 'Phase 3',
    color: 'from-amber-500/20 to-amber-900/10',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    vision: 'Clean energy is the next oil. Positioning in the sustainable revolution early — not for trend, but for legacy and responsibility to the planet.',
  },
  {
    id: 'food',
    name: 'Food Chain',
    icon: <UtensilsCrossed size={28} />,
    phase: 'Phase 2',
    color: 'from-green-500/20 to-green-900/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    vision: 'Halal, healthy, affordable — a food brand built on values not just profit. Nourishing communities while honouring our deen.',
  },
  {
    id: 'education',
    name: 'Education Fund',
    icon: <GraduationCap size={28} />,
    phase: 'Phase 1',
    color: 'from-indigo-500/20 to-indigo-900/10',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    vision: 'No exceptional mind should be held back by tuition. Scholarships and funding that change the destiny of brilliant people who simply needed a chance.',
  },
  {
    id: 'tourism',
    name: 'Luxury Tourism',
    icon: <Globe size={28} />,
    phase: 'Phase 4',
    color: 'from-teal-500/20 to-teal-900/10',
    borderColor: 'border-teal-500/30',
    iconColor: 'text-teal-400',
    vision: 'Premium Islamic-friendly travel experiences — halal travel reimagined for the sophisticated Muslim who refuses to compromise faith for comfort.',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    icon: <ShoppingCart size={28} />,
    phase: 'Phase 2',
    color: 'from-orange-500/20 to-orange-900/10',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-400',
    vision: 'Building digital commerce ecosystems that empower Muslim entrepreneurs to scale globally — products and platforms, not just storefronts.',
  },
  {
    id: 'media',
    name: 'Media Company',
    icon: <Tv size={28} />,
    phase: 'Phase 3',
    color: 'from-pink-500/20 to-pink-900/10',
    borderColor: 'border-pink-500/30',
    iconColor: 'text-pink-400',
    vision: 'The narrative must be owned. Building media that tells our story with excellence — finance, faith, and the future of the Muslim entrepreneur.',
  },
  {
    id: 'taxi',
    name: 'Taxi Platform',
    icon: <Car size={28} />,
    phase: 'Phase 4',
    color: 'from-yellow-500/20 to-yellow-900/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    vision: 'Fair, ethical ride-sharing — driver-first economics. Where the platform serves the driver, not exploits them.',
  },
  {
    id: 'charity',
    name: 'Charity Projects',
    icon: <HandHeart size={28} />,
    phase: 'Always',
    color: 'from-emerald/20 to-emerald/5',
    borderColor: 'border-emerald/30',
    iconColor: 'text-emerald',
    vision: 'Every empire must give back. Zakat, sadaqah, and impact woven into the business model — not as an afterthought but as the foundation.',
  },
]

function SectorCard({ sector, index }: { sector: typeof sectors[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="relative h-44 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80, damping: 15 }}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl border ${sector.borderColor} flex flex-col items-center justify-center gap-3 p-4 bg-gradient-to-br ${sector.color} backdrop-blur-sm`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`${sector.iconColor}`}>{sector.icon}</div>
          <div className="text-center">
            <p className="text-offwhite font-semibold text-sm">{sector.name}</p>
            <p className="text-silver/40 text-xs mt-1 tracking-wider uppercase">{sector.phase}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl border ${sector.borderColor} flex flex-col justify-between p-4 bg-gradient-to-br ${sector.color} backdrop-blur-sm`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs tracking-wider uppercase ${sector.iconColor} font-medium`}>{sector.name}</span>
            <span className="text-[10px] text-silver/40 uppercase tracking-wider border border-silver/20 px-2 py-0.5 rounded">{sector.phase}</span>
          </div>
          <p className="text-silver/75 text-xs leading-relaxed">{sector.vision}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function EmpireMap() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="empire" className="relative py-24 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060810] to-black" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gold/3 blur-[150px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-4"
          >
            10-Year Vision
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold gradient-text-gold mb-4"
          >
            The Empire Blueprint
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-silver/60 text-base md:text-lg max-w-xl mx-auto"
          >
            Vision beyond trading. Systems beyond income. Hover each sector to reveal the vision.
          </motion.p>
        </div>

        {/* Sectors grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sectors.map((sector, i) => (
            <SectorCard key={sector.id} sector={sector} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="text-center text-silver/30 text-xs mt-10 tracking-widest uppercase"
        >
          Building in phases &middot; Each empire begins with a single decision
        </motion.p>
      </div>
    </section>
  )
}
