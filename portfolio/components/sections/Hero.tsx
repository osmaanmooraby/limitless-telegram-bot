"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  color: string;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const colors = ["#C9A84C", "#FFD700", "#10B981", "#C0C0C0", "#E8C97A"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

const words = ["Wealth", "Systems", "Legacy", "Vision", "Empire"];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [wordIndex, setWordIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const scrollToStory = () => {
    const el = document.querySelector("#story");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Particle field */}
      {mounted && <ParticleCanvas />}

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#10B981]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/3 rounded-full blur-[150px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Pre-headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/80 font-medium">
            Crypto · Strategy · Legacy
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="font-light tracking-tight mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-white/90 leading-none">
            Building Wealth
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none mt-2">
            <span className="text-gradient-gold">Beyond Trading</span>
          </span>
        </motion.h1>

        {/* Animated word */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4 my-8"
        >
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#C9A84C]/30" />
          <div className="flex items-center gap-3 text-lg sm:text-xl tracking-[0.3em] uppercase text-[#C0C0C0]/60 font-light">
            <span>Systems</span>
            <span className="text-[#C9A84C]/40">·</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-[#C9A84C] min-w-[100px] text-center inline-block"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="text-[#C9A84C]/40">·</span>
            <span>Legacy</span>
          </div>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#C9A84C]/30" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[#C0C0C0]/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-12 tracking-wide"
        >
          Crypto Trader · Digital Strategist · Future Founder · Builder of{" "}
          <span className="text-[#C9A84C]">10x Limitless</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(201,168,76,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToStory}
            className="group relative px-10 py-4 bg-[#C9A84C] text-[#050505] text-sm tracking-[0.2em] uppercase font-bold overflow-hidden"
            style={{ borderRadius: "2px" }}
          >
            <span className="relative z-10">Enter My World</span>
            <div className="absolute inset-0 bg-[#FFD700] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 sr-only">Scroll to story</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const el = document.querySelector("#vip");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-10 py-4 border border-[#C9A84C]/30 text-[#C9A84C] text-sm tracking-[0.2em] uppercase font-medium hover:border-[#C9A84C]/70 hover:bg-[#C9A84C]/5 transition-all duration-300"
            style={{ borderRadius: "2px" }}
          >
            Explore 10x VIP
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-20"
        >
          {[
            { value: "5+", label: "Years Trading" },
            { value: "10K+", label: "Community Members" },
            { value: "∞", label: "Growth Mindset" },
            { value: "1", label: "Mission: Legacy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl sm:text-4xl font-light text-gradient-gold mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.value}
              </div>
              <div className="text-[9px] tracking-[0.3em] uppercase text-[#C0C0C0]/40">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#C0C0C0]/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-[#C9A84C]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
