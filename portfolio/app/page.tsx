"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import LifeStory from "@/components/sections/LifeStory";
import TradingDashboard from "@/components/sections/TradingDashboard";
import VIPSection from "@/components/sections/VIPSection";
import MediaHub from "@/components/sections/MediaHub";
import InnerWorld from "@/components/sections/InnerWorld";
import FutureEmpire from "@/components/sections/FutureEmpire";
import AIAssistant from "@/components/sections/AIAssistant";
import HiddenVault from "@/components/sections/HiddenVault";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = ["Initialising...", "Loading systems...", "Entering the world..."];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 8 + 3, 100);
        if (next > 33 && phase === 0) setPhase(1);
        if (next > 66 && phase === 1) setPhase(2);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onDone, 600);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onDone, phase]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center"
    >
      {/* Background pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full border border-[#C9A84C]/5"
          style={{ animation: "ping-ring 3s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full border border-[#C9A84C]/8"
          style={{ animation: "ping-ring 3s cubic-bezier(0,0,0.2,1) infinite", animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <div className="mb-12">
          <p
            className="text-5xl font-light tracking-[0.4em] text-gradient-gold uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Osmaan
          </p>
          <p className="text-[10px] tracking-[0.5em] text-[#C0C0C0]/30 uppercase mt-1">
            Mooraby
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-px bg-[#1A1A1A] relative mb-4">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              background: "linear-gradient(90deg, #C9A84C, #FFD700)",
              width: `${Math.min(progress, 100)}%`,
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-[#FFD700] rounded-full"
            style={{ left: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-[9px] tracking-[0.3em] text-[#C0C0C0]/20 font-mono">
            {phases[phase]}
          </p>
          <p className="text-[9px] tracking-[0.3em] text-[#C9A84C]/40 font-mono">
            {Math.min(Math.round(progress), 100)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    let followerX = -100, followerY = -100;
    let curX = -100, curY = -100;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      setCursorPos({ x: curX, y: curY });
    };

    const updateFollower = () => {
      followerX += (curX - followerX) * 0.12;
      followerY += (curY - followerY) * 0.12;
      setFollowerPos({ x: followerX, y: followerY });
      rafId = requestAnimationFrame(updateFollower);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(updateFollower);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div
        className="fixed w-3 h-3 bg-[#C9A84C] rounded-full pointer-events-none z-[99999] hidden md:block mix-blend-difference"
        style={{
          left: cursorPos.x - 6,
          top: cursorPos.y - 6,
          transition: "left 0.05s linear, top 0.05s linear",
        }}
      />
      <div
        className="fixed w-9 h-9 border border-[#C9A84C]/40 rounded-full pointer-events-none z-[99998] hidden md:block"
        style={{ left: followerPos.x - 18, top: followerPos.y - 18 }}
      />

      {/* Loading screen */}
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {!loading && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navigation />
            <Hero />
            <LifeStory />
            <TradingDashboard />
            <VIPSection />
            <MediaHub />
            <InnerWorld />
            <FutureEmpire />
            <AIAssistant />
            <HiddenVault />
            <FinalCTA />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
