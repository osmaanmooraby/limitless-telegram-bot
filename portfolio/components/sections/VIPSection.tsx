"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const vipCards = [
  {
    title: "Today's VIP Market Bias",
    preview: "Directional analysis updated every morning before the London session opens.",
    locked: false,
    badge: "LIVE",
    badgeColor: "#10B981",
    content: "BTC: Bullish above $67,200. Target zone $71,400–$72,800. Invalidation: close below $65,500 on 4H. ETH following closely — confirm BTC move first before entries.",
    icon: "📡",
  },
  {
    title: "Institutional Mindset Notes",
    preview: "Understand how the 1% actually thinks about capital allocation and risk.",
    locked: true,
    badge: "VIP",
    badgeColor: "#C9A84C",
    content: "Smart money is not entering at breakouts. They're accumulating in fear. Learn to read order flow divergence before price confirms direction.",
    icon: "🧠",
  },
  {
    title: "High Probability Scenarios",
    preview: "Pre-mapped setups for the week ahead — entries, targets, and stop zones.",
    locked: true,
    badge: "VIP",
    badgeColor: "#C9A84C",
    content: "Scenario A: BTC breaks $69,200 with volume → long momentum to $74K. Scenario B: Rejected at $69.2K → fade to $64,800 support retest before continuation.",
    icon: "🎯",
  },
  {
    title: "Common Retail Mistakes",
    preview: "What most traders do that guarantees they stay poor — and how to stop.",
    locked: true,
    badge: "VIP",
    badgeColor: "#C9A84C",
    content: "FOMO at ATH. Overleveraging. No defined exit. Revenge trading after a loss. Treating every dip as a bottom. These five patterns alone account for 80% of blown accounts.",
    icon: "⚠️",
  },
  {
    title: "Weekly Alpha Report",
    preview: "Deep-dive market analysis sent every Sunday night before the week opens.",
    locked: true,
    badge: "EXCLUSIVE",
    badgeColor: "#C9A84C",
    content: "Full macro context, on-chain metrics, exchange flows, and Osmaan's personal conviction levels for the week ahead.",
    icon: "📋",
  },
  {
    title: "Risk Management Framework",
    preview: "The exact system used to protect capital through every market cycle.",
    locked: true,
    badge: "FRAMEWORK",
    badgeColor: "#C0C0C0",
    content: "Position sizing. Correlation limits. Maximum drawdown triggers. The framework that kept capital safe through every major crash.",
    icon: "🛡️",
  },
];

function VIPCard({ card, index }: { card: typeof vipCards[0]; index: number }) {
  const [revealed, setReveal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <div
        className="relative overflow-hidden rounded-sm p-6 h-full transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${card.badgeColor}20`,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Hover border glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-sm"
          style={{ boxShadow: `inset 0 0 30px ${card.badgeColor}08, 0 0 30px ${card.badgeColor}08` }}
        />

        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{ background: `linear-gradient(90deg, ${card.badgeColor}60, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{card.icon}</span>
            <span
              className="text-[8px] tracking-[0.3em] uppercase px-2 py-1 rounded"
              style={{ color: card.badgeColor, background: card.badgeColor + "15", border: `1px solid ${card.badgeColor}30` }}
            >
              {card.badge}
            </span>
          </div>
          {card.locked && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#C9A84C]/50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-light text-white/90 mb-3 leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {card.title}
        </h3>

        {/* Content — locked or revealed */}
        {card.locked && !revealed ? (
          <div className="relative">
            <div className="text-sm text-[#C0C0C0]/50 leading-relaxed blur-sm select-none">
              {card.content}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setReveal(true)}
                className="text-[9px] tracking-[0.2em] uppercase text-[#C9A84C]/60 border border-[#C9A84C]/20 px-3 py-1.5 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-all duration-300 backdrop-blur-sm"
              >
                VIP Only
              </button>
            </div>
          </div>
        ) : (
          <motion.p
            initial={revealed ? { opacity: 0, filter: "blur(8px)" } : {}}
            animate={revealed ? { opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm text-[#C0C0C0]/60 leading-relaxed"
          >
            {card.locked ? card.content : card.content}
          </motion.p>
        )}

        {/* Preview tag for locked */}
        {card.locked && !revealed && (
          <p className="text-[10px] text-[#C0C0C0]/30 mt-3 italic">{card.preview}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function VIPSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="vip" className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#C9A84C]/2" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A84C]/4 rounded-full blur-[200px]" />
      </div>

      {/* Vault pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 40px)`,
        }}
      />

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
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">Restricted Access</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="text-gradient-gold">10x Limitless</span> VIP
          </h2>
          <p className="text-[#C0C0C0]/50 text-base max-w-lg mx-auto leading-relaxed">
            Not a signals group. Not a course. A private intelligence network for traders who take their craft seriously.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {vipCards.map((card, i) => (
            <VIPCard key={card.title} card={card} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-6">
            <p className="text-[#C0C0C0]/40 text-sm tracking-wider italic">
              "The serious ones find a way. The rest find an excuse."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(201,168,76,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="group px-10 py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[#050505] text-sm tracking-[0.2em] uppercase font-bold relative overflow-hidden rounded-none"
                style={{ borderRadius: "2px" }}
              >
                Apply For VIP Access
              </motion.a>
              <span className="text-[10px] text-[#C0C0C0]/30 tracking-[0.2em] uppercase">Limited Spots Available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
