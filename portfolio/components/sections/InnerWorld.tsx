"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reflections = [
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever places their trust in Allah — He is sufficient for them.",
    source: "Surah At-Talaq, 65:3",
    reflection: "Every trade setup. Every business decision. Every step into the unknown. True confidence is not arrogance — it is tawakkul. You plan with precision, you act with discipline, and then you release the outcome with complete trust. That's the state that separates the calm from the anxious.",
    color: "#C9A84C",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship will come ease.",
    source: "Surah Ash-Sharh, 94:6",
    reflection: "The losing streaks. The months where nothing worked. The nights of doubt. The Islamic tradition doesn't deny the pain — it places it in context. Every period of compression in a market is followed by expansion. Every period of hardship in a life is followed by relief. This is not wishful thinking. This is divine law.",
    color: "#10B981",
  },
  {
    arabic: "قَالَ رُوحُ الْقُدُسِ فِي رُوعِي",
    translation: "Spoken wisdom that comes to the heart in moments of stillness.",
    source: "From the Hadith tradition",
    reflection: "The best insights don't come from more screen time. They come from fajr prayer. From walks in silence. From reading with no agenda. The greatest traders, businesspeople, and thinkers throughout history shared one practice: they created space for clarity to arrive. In the age of noise, stillness is the ultimate edge.",
    color: "#C0C0C0",
  },
  {
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    translation: "The world is a prison for the believer and paradise for the disbeliever.",
    source: "Sahih Muslim",
    reflection: "This is not a statement of pessimism — it is a statement of liberation. When you understand that this world is temporary, you stop being enslaved by it. You build wealth without being consumed by it. You aim for legacy, not lifestyle. You work for the hereafter while maximising your contribution here.",
    color: "#C9A84C",
  },
];

const wisdomPillars = [
  { title: "Dhikr", subtitle: "Remembrance", text: "The constant return to presence. In trading, it manifests as staying in the process and not the result. In life, it is the antidote to distraction.", icon: "🌙" },
  { title: "Tawakkul", subtitle: "Surrender After Action", text: "Complete trust after complete effort. The highest form of emotional intelligence is knowing the difference between what you can and cannot control.", icon: "✨" },
  { title: "Sabr", subtitle: "Noble Patience", text: "Not passive waiting — active endurance. The same quality that keeps a trader in a winning trade is the quality that builds empires.", icon: "⚖️" },
  { title: "Ihsan", subtitle: "Excellence in All Things", text: "Performing every task as if the Divine is watching. Whether it's a trade analysis or a community message — excellence is the minimum standard.", icon: "💎" },
];

export default function InnerWorld() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="inner" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Very subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A84C]/3 rounded-full blur-[250px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10B981]/2 rounded-full blur-[250px]" />
      </div>

      {/* Arabesque subtle pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">The Inner World</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Where Wealth Meets <span className="text-gradient-gold">Soul</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-base max-w-2xl mx-auto leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "You cannot build an empire on a broken foundation. Fix the interior first. The exterior follows."
          </p>
        </motion.div>

        {/* Quranic Reflections */}
        <div className="space-y-8 mb-24">
          {reflections.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative group"
            >
              <div
                className="p-8 lg:p-10 rounded-sm relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${r.color}15`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${r.color}40, transparent)` }}
                />

                {/* Arabic text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-center mb-6"
                >
                  <p
                    className="text-2xl lg:text-3xl font-light leading-loose mb-3"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: r.color,
                      direction: "rtl",
                    }}
                  >
                    {r.arabic}
                  </p>
                  <p className="text-sm text-[#C0C0C0]/60 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {r.translation}
                  </p>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[#C0C0C0]/30 mt-2">
                    — {r.source}
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="line-gold mb-6" />

                {/* Reflection */}
                <p className="text-[#C0C0C0]/60 leading-relaxed text-sm lg:text-base text-center max-w-3xl mx-auto">
                  {r.reflection}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wisdom Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h3
            className="text-3xl lg:text-4xl font-light text-white/70 mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Four Pillars of the <span className="text-gradient-gold">Inner Game</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {wisdomPillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-sm group transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{pillar.icon}</span>
                <div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h4
                      className="text-xl font-light text-gradient-gold"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {pillar.title}
                    </h4>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[#C0C0C0]/30">
                      {pillar.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-[#C0C0C0]/55 leading-relaxed">{pillar.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Silent lesson */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="text-center mt-20"
        >
          <p
            className="text-2xl lg:text-3xl font-light text-[#C0C0C0]/30 leading-loose italic"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            "The mountain does not tremble because the wind says it should.<br />
            <span className="text-[#C9A84C]/50">Know what you are, and nothing can shake you."</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
