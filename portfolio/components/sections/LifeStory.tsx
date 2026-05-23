"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const chapters = [
  {
    number: "01",
    title: "The Struggle",
    subtitle: "Where It All Began",
    body: "Before the charts, before the systems, before the community — there was just a young man from a modest background asking one question the world didn't want to answer: why do the same people stay broke while others build empires? The struggle wasn't just financial. It was a war against a mindset handed down through generations. A war worth fighting.",
    color: "#C0C0C0",
    accent: "silver",
    icon: "⚡",
  },
  {
    number: "02",
    title: "The Awakening",
    subtitle: "When the World Shifted",
    body: "One book. One conversation. One moment of clarity that changed everything. The awakening wasn't loud — it was quiet, like a door slowly opening onto a room filled with light. The realisation that wealth is a science, not a stroke of luck. That markets move by design, not chance. That discipline is the greatest luxury a person can own.",
    color: "#C9A84C",
    accent: "gold",
    icon: "🌅",
  },
  {
    number: "03",
    title: "The Trader",
    subtitle: "Reading Markets Like A Language",
    body: "Crypto became the vehicle. Not because of the hype — but because it was the most honest market in the world: pure psychology, pure supply and demand, pure human emotion expressed in real time. Learning to trade meant learning to master fear, greed, patience, and timing simultaneously. Most fail here. The few who survive discover something priceless.",
    color: "#10B981",
    accent: "emerald",
    icon: "📊",
  },
  {
    number: "04",
    title: "The Strategist",
    subtitle: "Systems Over Emotion",
    body: "Trading alone was never the goal. The real mission was building systems that compound. Digital products. Communities. Knowledge infrastructure. The strategist in Osmaan emerged when he understood that the most valuable assets aren't on any exchange — they're built in the mind, deployed with precision, and scaled through leverage of time and team.",
    color: "#C9A84C",
    accent: "gold",
    icon: "♟️",
  },
  {
    number: "05",
    title: "The Builder",
    subtitle: "10x Limitless Is Born",
    body: "10x Limitless wasn't created to sell courses. It was built as a movement — for the 5am risers, the ones who still believe in something bigger than a salary, the traders who want edge not entertainment. Every signal, every analysis, every lesson inside 10x Limitless is a piece of the architecture of financial freedom. Built for serious people. Designed for results.",
    color: "#10B981",
    accent: "emerald",
    icon: "🏗️",
  },
  {
    number: "06",
    title: "The Legacy",
    subtitle: "Beyond Wealth",
    body: "Legacy is not what you leave behind in a will. Legacy is the system you build that outlives your presence. It's the mindset you plant in others. The charities funded. The hospitals built. The young people who never knew poverty because someone upstream made the right decisions. Osmaan's legacy chapter is being written — one system, one soul, one generation at a time.",
    color: "#C9A84C",
    accent: "gold",
    icon: "🌿",
  },
];

function ChapterCard({ chapter, index }: { chapter: typeof chapters[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      <div
        className="glass rounded-sm p-8 lg:p-10 relative overflow-hidden group hover:border-opacity-40 transition-all duration-500"
        style={{
          border: `1px solid ${chapter.color}20`,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${chapter.color}08 0%, transparent 70%)`,
          }}
        />

        {/* Corner accent */}
        <div
          className="absolute top-0 left-0 w-16 h-px"
          style={{ background: chapter.color }}
        />
        <div
          className="absolute top-0 left-0 w-px h-16"
          style={{ background: chapter.color }}
        />

        <div className="flex items-start gap-6">
          {/* Number */}
          <div className="flex-shrink-0">
            <span
              className="text-5xl lg:text-6xl font-light opacity-20"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: chapter.color,
              }}
            >
              {chapter.number}
            </span>
          </div>

          <div className="flex-1">
            {/* Icon + subtitle */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">{chapter.icon}</span>
              <span
                className="text-[10px] tracking-[0.3em] uppercase opacity-60"
                style={{ color: chapter.color }}
              >
                {chapter.subtitle}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-3xl lg:text-4xl font-light text-white/90 mb-5 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {chapter.title}
            </h3>

            {/* Body */}
            <p className="text-[#C0C0C0]/60 leading-relaxed text-sm lg:text-base">
              {chapter.body}
            </p>

            {/* Bottom line */}
            <div
              className="mt-6 h-px w-0 group-hover:w-full transition-all duration-700"
              style={{ background: `linear-gradient(90deg, ${chapter.color}40, transparent)` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LifeStory() {
  const ref = useRef<HTMLDivElement>(null);
  const titleInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="story" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C9A84C]/4 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#10B981]/3 rounded-full blur-[150px] -translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">
              The Story
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Six Chapters of <span className="text-gradient-gold">Becoming</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-base max-w-xl mx-auto leading-relaxed">
            Every empire begins with a single decision. This is the story of how one man chose to rewrite the rules of what's possible.
          </p>
        </motion.div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent hidden lg:block" />

          {/* Chapters */}
          <div className="space-y-6">
            {chapters.map((chapter, i) => (
              <ChapterCard key={chapter.number} chapter={chapter} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
