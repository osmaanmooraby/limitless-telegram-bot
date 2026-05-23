"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const sectors = [
  {
    id: "airline",
    icon: "✈️",
    label: "Airline",
    vision: "A premium regional airline connecting underserved Muslim-majority cities with dignity, efficiency, and world-class service. Flying should never feel like a burden.",
    color: "#627EEA",
    size: "large",
  },
  {
    id: "realestate",
    icon: "🏛️",
    label: "Real Estate",
    vision: "Strategic property portfolios across the UK, UAE, and Pakistan. Not just investment — but creating spaces where communities thrive and generational wealth is built.",
    color: "#C9A84C",
    size: "medium",
  },
  {
    id: "telecom",
    icon: "📡",
    label: "Telecom",
    vision: "Affordable, fast connectivity for communities that currently pay too much for too little. Technology access is a human right in the digital age.",
    color: "#10B981",
    size: "medium",
  },
  {
    id: "hospital",
    icon: "🏥",
    label: "Hospital",
    vision: "A network of hospitals in regions where quality healthcare is a luxury. Healing should be accessible to everyone, regardless of their postcode or income.",
    color: "#EF4444",
    size: "medium",
  },
  {
    id: "solar",
    icon: "☀️",
    label: "Solar Energy",
    vision: "Renewable energy infrastructure in developing nations. Clean power for communities that have been burning fossil fuels by necessity, not choice.",
    color: "#F59E0B",
    size: "small",
  },
  {
    id: "food",
    icon: "🍽️",
    label: "Food Chain",
    vision: "A halal restaurant empire — premium quality at accessible prices. From street food to fine dining, with the same standard of excellence throughout.",
    color: "#10B981",
    size: "small",
  },
  {
    id: "education",
    icon: "📚",
    label: "Education Fund",
    vision: "Full scholarships for gifted students from low-income families. The greatest return on investment is a mind unlocked.",
    color: "#9945FF",
    size: "small",
  },
  {
    id: "tourism",
    icon: "🌿",
    label: "Luxury Tourism",
    vision: "Boutique luxury experiences in Morocco, Turkey, and the Maldives. Showing the world the refined elegance of Islamic culture through travel.",
    color: "#C9A84C",
    size: "medium",
  },
  {
    id: "ecommerce",
    icon: "🛒",
    label: "E-Commerce",
    vision: "A curated marketplace for premium ethical products — Muslim-owned brands with international reach and world-class brand presentation.",
    color: "#C0C0C0",
    size: "small",
  },
  {
    id: "media",
    icon: "📺",
    label: "Media Company",
    vision: "A media house that tells our stories with full depth and nuance. Representation that doesn't apologise or over-explain. Just truth, quality, and excellence.",
    color: "#EF4444",
    size: "medium",
  },
  {
    id: "taxi",
    icon: "🚗",
    label: "Taxi Platform",
    vision: "An Uber alternative in regions where drivers are exploited by foreign platforms. Fair pay, local ownership, community-first technology.",
    color: "#F59E0B",
    size: "small",
  },
  {
    id: "charity",
    icon: "🤲",
    label: "Charity Projects",
    vision: "A foundation distributing Zakat and Sadaqah with full transparency. Clean water. Orphan sponsorship. Emergency relief. The empire's most important work.",
    color: "#10B981",
    size: "large",
  },
];

export default function FutureEmpire() {
  const [active, setActive] = useState<typeof sectors[0] | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="empire" className="relative py-32 bg-[#060606] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C9A84C]/3 rounded-full blur-[300px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">The Vision</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The <span className="text-gradient-gold">Future Empire</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-sm max-w-lg mx-auto leading-relaxed">
            Every great empire began as a vision held by a single mind. Hover each sector to see the vision behind it.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setActive(active?.id === sector.id ? null : sector)}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative cursor-pointer rounded-sm overflow-hidden transition-all duration-300 ${
                sector.size === "large" ? "col-span-2" : ""
              }`}
              style={{
                background: active?.id === sector.id
                  ? sector.color + "15"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${active?.id === sector.id ? sector.color + "50" : "rgba(255,255,255,0.06)"}`,
                minHeight: sector.size === "large" ? "140px" : "120px",
              }}
            >
              {/* Glow on active */}
              {active?.id === sector.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 30px ${sector.color}20` }}
                />
              )}

              <div className="p-5 flex flex-col h-full justify-between">
                <div>
                  <span className="text-2xl">{sector.icon}</span>
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: active?.id === sector.id ? sector.color : "#F8F8F8CC" }}
                  >
                    {sector.label}
                  </p>
                  <motion.div
                    className="h-0.5 w-6 rounded-full"
                    animate={{ width: active?.id === sector.id ? "40px" : "16px" }}
                    style={{ background: sector.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vision panel */}
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div
                className="p-8 lg:p-10 rounded-sm relative overflow-hidden"
                style={{
                  background: active.color + "08",
                  border: `1px solid ${active.color}25`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${active.color}60, transparent)` }}
                />
                <div className="flex items-start gap-6">
                  <span className="text-4xl flex-shrink-0">{active.icon}</span>
                  <div>
                    <h3
                      className="text-2xl lg:text-3xl font-light mb-4"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: active.color }}
                    >
                      {active.label}
                    </h3>
                    <p className="text-[#C0C0C0]/70 leading-relaxed text-base max-w-3xl">
                      {active.vision}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#C0C0C0]/20 text-sm tracking-wider italic mt-4"
          >
            Click any sector to reveal the vision
          </motion.p>
        )}
      </div>
    </section>
  );
}
