"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const categories = ["All", "Wealth Psychology", "Trading Education", "Market Manipulation", "Life Philosophy", "Sufi Reflections", "Financial Awakening"];

const mediaItems = [
  {
    title: "The Psychology of Losing Trades",
    category: "Wealth Psychology",
    duration: "18 min",
    type: "Video",
    desc: "Why your biggest enemy in trading is not the market — it's the story you tell yourself after a loss.",
    gradient: "from-[#C9A84C]/20 to-[#050505]",
    accent: "#C9A84C",
  },
  {
    title: "How Smart Money Moves Markets",
    category: "Market Manipulation",
    duration: "24 min",
    type: "Deep Dive",
    desc: "The mechanics of stop hunts, liquidity grabs, and why retail always buys the top and sells the bottom.",
    gradient: "from-[#EF4444]/20 to-[#050505]",
    accent: "#EF4444",
  },
  {
    title: "Tawakkul in the Markets",
    category: "Sufi Reflections",
    duration: "12 min",
    type: "Reflection",
    desc: "What does it mean to plan perfectly and then surrender the outcome? The Islamic principle that unlocks elite trader psychology.",
    gradient: "from-[#10B981]/20 to-[#050505]",
    accent: "#10B981",
  },
  {
    title: "From Broke to Building",
    category: "Financial Awakening",
    duration: "31 min",
    type: "Story",
    desc: "The raw, unfiltered journey from financial illiteracy to building multiple income streams. No highlights reel — just truth.",
    gradient: "from-[#9945FF]/20 to-[#050505]",
    accent: "#9945FF",
  },
  {
    title: "EMA Strategy Masterclass",
    category: "Trading Education",
    duration: "45 min",
    type: "Masterclass",
    desc: "The complete framework for using exponential moving averages to time entries, exits, and trend reversals with precision.",
    gradient: "from-[#627EEA]/20 to-[#050505]",
    accent: "#627EEA",
  },
  {
    title: "The Poverty Mindset Trap",
    category: "Life Philosophy",
    duration: "22 min",
    type: "Philosophy",
    desc: "Generations of scarcity thinking passed down through families. How to identify it, break it, and install abundance frameworks.",
    gradient: "from-[#C9A84C]/20 to-[#050505]",
    accent: "#C9A84C",
  },
  {
    title: "Institutional Order Flow 101",
    category: "Trading Education",
    duration: "38 min",
    type: "Education",
    desc: "Reading the market from the top down. How to align your trades with the direction of institutional money, not against it.",
    gradient: "from-[#10B981]/20 to-[#050505]",
    accent: "#10B981",
  },
  {
    title: "The Wisdom of Rumi on Wealth",
    category: "Sufi Reflections",
    duration: "15 min",
    type: "Reflection",
    desc: "Ancient wisdom that modern finance forgot. What the greatest Sufi poets understood about abundance, detachment, and flow.",
    gradient: "from-[#F59E0B]/20 to-[#050505]",
    accent: "#F59E0B",
  },
  {
    title: "Building While Working 9 to 5",
    category: "Financial Awakening",
    duration: "27 min",
    type: "Strategy",
    desc: "The exact blueprint for building your trading and digital business in the margins of a full-time job. No excuses, just systems.",
    gradient: "from-[#C0C0C0]/20 to-[#050505]",
    accent: "#C0C0C0",
  },
];

function MediaCard({ item, index }: { item: typeof mediaItems[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer overflow-hidden rounded-sm"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(255,255,255,0.06)`,
      }}
    >
      {/* Thumbnail area */}
      <div
        className="relative h-40 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${item.accent}15, #0D0D0D)` }}
      >
        {/* Animated gradient on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 50%, ${item.accent}20, transparent 70%)` }}
        />

        {/* Play button */}
        <motion.div
          animate={{ scale: hovered ? 1.1 : 1, opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border"
            style={{ borderColor: item.accent + "60", background: item.accent + "15" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={item.accent}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </motion.div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-[9px] tracking-wider px-2 py-1 font-mono rounded"
            style={{ background: "#0D0D0D90", color: item.accent, border: `1px solid ${item.accent}30` }}
          >
            {item.duration}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[8px] tracking-[0.2em] uppercase px-2 py-1 rounded"
            style={{ background: item.accent + "20", color: item.accent }}
          >
            {item.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-[8px] tracking-[0.3em] uppercase mb-2" style={{ color: item.accent + "90" }}>
          {item.category}
        </div>
        <h3
          className="text-base font-light text-white/85 mb-2 leading-snug group-hover:text-white transition-colors duration-300"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {item.title}
        </h3>
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
          className="text-xs text-[#C0C0C0]/50 leading-relaxed overflow-hidden"
        >
          {item.desc}
        </motion.p>
      </div>

      {/* Bottom hover line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ background: item.accent }}
      />
    </motion.div>
  );
}

export default function MediaHub() {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = activeCategory === "All"
    ? mediaItems
    : mediaItems.filter((m) => m.category === activeCategory);

  return (
    <section id="media" className="relative py-32 bg-[#060606] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C9A84C]/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">Content Hub</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The <span className="text-gradient-gold">Media Library</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-sm max-w-lg mx-auto">
            From market mechanics to mindset philosophy. Every piece designed to shift your perspective permanently.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 rounded-sm"
              style={{
                background: activeCategory === cat ? "#C9A84C" : "rgba(255,255,255,0.03)",
                color: activeCategory === cat ? "#050505" : "rgba(192,192,192,0.6)",
                border: `1px solid ${activeCategory === cat ? "#C9A84C" : "rgba(255,255,255,0.06)"}`,
                fontWeight: activeCategory === cat ? "700" : "400",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <MediaCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
