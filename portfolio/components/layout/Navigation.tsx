"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Markets", href: "#trading" },
  { label: "10x VIP", href: "#vip" },
  { label: "Media", href: "#media" },
  { label: "Empire", href: "#empire" },
  { label: "Inner World", href: "#inner" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#C9A84C]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="flex flex-col">
                <span
                  className="text-xl font-semibold tracking-widest text-gradient-gold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  OSMAAN
                </span>
                <span className="text-[9px] tracking-[0.35em] text-[#C0C0C0]/60 uppercase">
                  Mooraby
                </span>
              </div>
            </motion.div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleClick(link.href)}
                  className="text-[11px] tracking-[0.2em] uppercase text-[#C0C0C0]/70 hover:text-[#C9A84C] transition-colors duration-300 font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleClick("#vip")}
                className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-semibold border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/80 transition-all duration-300 rounded"
              >
                Join VIP
              </motion.button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <motion.span
                animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
                className="block h-px w-6 bg-[#C9A84C]"
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                className="block h-px w-6 bg-[#C0C0C0]/60"
              />
              <motion.span
                animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
                className="block h-px w-6 bg-[#C9A84C]"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleClick(link.href)}
                className="text-3xl font-light tracking-widest text-white/80 hover:text-[#C9A84C] transition-colors"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleClick("#vip")}
              className="mt-4 px-8 py-3 border border-[#C9A84C]/50 text-[#C9A84C] text-sm tracking-[0.2em] uppercase"
            >
              Join VIP
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
