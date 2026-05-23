"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#040404] border-t border-[#C9A84C]/10 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p
              className="text-xl tracking-widest text-gradient-gold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              OSMAAN MOORABY
            </p>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#C0C0C0]/30 mt-1">
              10x Limitless · Systems · Vision · Legacy
            </p>
          </div>
          <div className="flex items-center gap-6">
            {["Telegram", "Twitter", "Instagram"].map((s) => (
              <motion.a
                key={s}
                href="#"
                whileHover={{ color: "#C9A84C" }}
                className="text-[10px] tracking-[0.2em] uppercase text-[#C0C0C0]/25 hover:text-[#C9A84C] transition-colors duration-300"
              >
                {s}
              </motion.a>
            ))}
          </div>
          <p className="text-[9px] text-[#C0C0C0]/20 tracking-wider">
            © 2024 Osmaan Mooraby
          </p>
        </div>
      </div>
    </footer>
  );
}
