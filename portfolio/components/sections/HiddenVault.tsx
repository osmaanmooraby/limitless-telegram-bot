"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const vaultItems = [
  { label: "The Exact Risk Framework", hint: "Position size formula used on every trade" },
  { label: "Monthly Review Template", hint: "The self-audit that separates growing traders from plateaued ones" },
  { label: "Manipulation Patterns Bible", hint: "32 identified institutional traps with visual examples" },
  { label: "The Empire Blueprint", hint: "Full business expansion roadmap for the next decade" },
  { label: "Mindset Audio Sessions", hint: "Osmaan's private voice recordings on fear, purpose, and discipline" },
  { label: "VIP Watchlist — This Week", hint: "Assets under close surveillance with entry conditions" },
];

export default function HiddenVault() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const tryUnlock = () => {
    if (code === "10X" || code === "10x") {
      setUnlocked(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setCode("");
    }
  };

  return (
    <section id="vault" className="relative py-32 bg-[#040404] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#040404] to-[#050505]" />
        {/* Vault pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(201,168,76,0.5) 0px, rgba(201,168,76,0.5) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(90deg, rgba(201,168,76,0.5) 0px, rgba(201,168,76,0.5) 1px, transparent 1px, transparent 80px)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/4 rounded-full blur-[300px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Vault icon */}
          <motion.div
            animate={{ rotateY: unlocked ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#C9A84C]/30 mb-8 relative"
            style={{ background: "rgba(201,168,76,0.05)" }}
          >
            <motion.div
              animate={{ opacity: unlocked ? 0 : 1 }}
              className="absolute"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeOpacity="0.7">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" fill="#C9A84C" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ opacity: unlocked ? 1 : 0 }}
              className="absolute"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                <circle cx="12" cy="16" r="1" fill="#10B981" />
              </svg>
            </motion.div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C9A84C]/40 animate-ping-ring" />
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">Restricted</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The <span className="text-gradient-gold">Vault</span>
          </h2>
          <p className="text-[#C0C0C0]/40 text-sm max-w-sm mx-auto leading-relaxed italic">
            For serious minds only.
          </p>
        </motion.div>

        {/* Locked content preview */}
        <div className="relative mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vaultItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <div
                  className={`p-5 rounded-sm transition-all duration-500 ${!unlocked ? "filter blur-[3px] select-none" : ""}`}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid rgba(201,168,76,0.1)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
                      {unlocked ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-white/70 font-light">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-[#C0C0C0]/35 pl-9">{item.hint}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overlay */}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-[#040404]/50 to-[#040404]/80 rounded-sm">
              <div className="text-center">
                <p className="text-[#C9A84C]/40 text-xs tracking-[0.3em] uppercase mb-2">
                  Protected Content
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Unlock interface */}
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-[#C0C0C0]/30 text-xs tracking-widest uppercase mb-6">
                Enter access code to unlock
              </p>
              <motion.div
                animate={{ x: shake ? [-8, 8, -8, 8, 0] : 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 max-w-xs mx-auto"
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
                  placeholder="ACCESS CODE"
                  maxLength={6}
                  className="flex-1 bg-transparent border-b border-[#C9A84C]/20 text-center text-sm tracking-[0.4em] uppercase text-[#C9A84C] placeholder-[#C0C0C0]/20 outline-none py-2 focus:border-[#C9A84C]/50 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={tryUnlock}
                  className="px-5 py-2 border border-[#C9A84C]/30 text-[#C9A84C]/70 text-xs tracking-widest hover:bg-[#C9A84C]/10 transition-all rounded-sm"
                >
                  Enter
                </motion.button>
              </motion.div>
              <p className="text-[#C0C0C0]/15 text-[9px] tracking-wider mt-4 italic">
                Hint: The number before Limitless
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                <span className="text-[#10B981] text-xs tracking-[0.3em] uppercase">Vault Unlocked</span>
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              </div>
              <p className="text-[#C0C0C0]/40 text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Welcome to the inner circle.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
