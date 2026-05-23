"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[250px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#10B981]/4 rounded-full blur-[200px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center py-32" ref={ref}>
        {/* Pre-label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/70">The Final Word</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="font-light leading-tight mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="block text-4xl sm:text-6xl lg:text-7xl text-white/90 mb-2">
            Build the system.
          </span>
          <span className="block text-4xl sm:text-6xl lg:text-7xl text-gradient-gold mb-2">
            Master the mind.
          </span>
          <span className="block text-4xl sm:text-6xl lg:text-7xl text-white/90">
            Leave a legacy.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#C0C0C0]/50 text-base max-w-2xl mx-auto leading-relaxed mb-16 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          "The grave does not care about your excuses. It only acknowledges what you built, who you helped, and how you lived. Start now. Not tomorrow. Now."
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.a
            href="#vip"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#vip")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(201,168,76,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="group px-12 py-5 bg-gradient-to-r from-[#C9A84C] to-[#E8C97A] text-[#050505] text-sm tracking-[0.2em] uppercase font-bold relative overflow-hidden"
            style={{ borderRadius: "2px" }}
          >
            <span className="relative z-10">Join 10x Limitless</span>
            <div className="absolute inset-0 bg-[#FFD700] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          </motion.a>

          <motion.a
            href="#story"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#story")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-5 border border-[#C0C0C0]/20 text-[#C0C0C0]/70 text-sm tracking-[0.2em] uppercase hover:border-[#C0C0C0]/40 hover:text-white transition-all duration-300"
            style={{ borderRadius: "2px" }}
          >
            Explore My Work
          </motion.a>

          <motion.a
            href="mailto:hello@osmaanmooraby.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-5 border border-[#10B981]/20 text-[#10B981]/70 text-sm tracking-[0.2em] uppercase hover:border-[#10B981]/40 hover:text-[#10B981] hover:bg-[#10B981]/5 transition-all duration-300"
            style={{ borderRadius: "2px" }}
          >
            Contact Osmaan
          </motion.a>
        </motion.div>

        {/* Divider */}
        <div className="line-gold mb-10" />

        {/* Social links & footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Social */}
          <div className="flex items-center gap-6">
            {[
              { label: "Telegram", href: "#", icon: "T" },
              { label: "Twitter / X", href: "#", icon: "X" },
              { label: "Instagram", href: "#", icon: "I" },
              { label: "YouTube", href: "#", icon: "Y" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, color: "#C9A84C" }}
                className="text-[10px] tracking-[0.2em] uppercase text-[#C0C0C0]/30 hover:text-[#C9A84C] transition-colors duration-300"
              >
                {social.label}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#C0C0C0]/20">
            © 2024 Osmaan Mooraby · 10x Limitless · All Rights Reserved
          </p>

          {/* Final arabic */}
          <p
            className="text-[#C9A84C]/20 text-base font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", direction: "rtl" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </motion.div>
      </div>
    </section>
  );
}
