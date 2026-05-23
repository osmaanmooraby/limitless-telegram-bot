"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const cryptoPrices = [
  { symbol: "BTC", name: "Bitcoin", price: "67,842", change: "+2.34%", positive: true, volume: "42.3B", color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", price: "3,521", change: "+1.87%", positive: true, volume: "18.6B", color: "#627EEA" },
  { symbol: "SOL", name: "Solana", price: "178.40", change: "-0.92%", positive: false, volume: "4.2B", color: "#9945FF" },
];

const emaData = [
  { period: "EMA 20", value: "67,140", status: "Above", color: "#10B981" },
  { period: "EMA 50", value: "64,800", status: "Above", color: "#10B981" },
  { period: "EMA 200", value: "52,300", status: "Above", color: "#10B981" },
  { period: "RSI (14)", value: "62.4", status: "Neutral", color: "#C9A84C" },
];

function AnimatedNumber({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = num * ease;
      if (value.includes(",")) {
        setDisplay(current.toLocaleString("en-US", { maximumFractionDigits: 0 }));
      } else {
        setDisplay(current.toFixed(1));
      }
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function MiniChart({ positive, color }: { positive: boolean; color: string }) {
  const points = positive
    ? [40, 35, 42, 30, 38, 28, 35, 22, 30, 18, 25, 15]
    : [15, 18, 12, 20, 16, 22, 18, 28, 22, 32, 26, 38];
  const w = 80, h = 40;
  const max = Math.max(...points), min = Math.min(...points);
  const normalize = (v: number) => h - ((v - min) / (max - min)) * h;
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${normalize(p)}`).join(" ");
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? "#10B981" : "#EF4444"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color})`} />
      <path d={pathD} stroke={positive ? "#10B981" : "#EF4444"} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SentimentMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="glass-gold rounded-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/70">Market Sentiment</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] text-[#10B981]">LIVE</span>
        </div>
      </div>
      <div className="relative h-3 bg-[#1A1A1A] rounded-full overflow-hidden mb-3">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#10B981]" />
        <motion.div
          initial={{ width: "0%" }}
          animate={inView ? { width: "72%" } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute inset-y-0 right-0 bg-[#0D0D0D]"
        />
        <motion.div
          initial={{ left: "0%" }}
          animate={inView ? { left: "69%" } : {}}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#C9A84C] shadow-gold z-10"
          style={{ boxShadow: "0 0 8px #C9A84C" }}
        />
      </div>
      <div className="flex justify-between text-[9px] tracking-widest uppercase text-[#C0C0C0]/40">
        <span>Extreme Fear</span>
        <span className="text-[#C9A84C] text-base font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Greed — 72</span>
        <span>Extreme Greed</span>
      </div>
    </div>
  );
}

function LiquidationZone() {
  const zones = [
    { level: "$71,200", type: "Short Liquidation", amount: "$840M", bar: 85 },
    { level: "$65,000", type: "Long Support", amount: "$620M", bar: 62 },
    { level: "$60,500", type: "Major Long Zone", amount: "$1.2B", bar: 100 },
  ];

  return (
    <div className="glass rounded-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C0C0C0]/60">Liquidation Zones</span>
        <span className="text-[9px] text-[#EF4444]/70 tracking-widest">HIGH RISK</span>
      </div>
      <div className="space-y-4">
        {zones.map((z) => (
          <div key={z.level} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#C0C0C0]/70">{z.level}</span>
              <span className="text-[#C9A84C]/80">{z.amount}</span>
            </div>
            <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${z.bar}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-[#EF4444]/50 to-[#EF4444]"
              />
            </div>
            <div className="text-[9px] text-[#C0C0C0]/40 tracking-widest uppercase">{z.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TradingDashboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="trading" className="relative py-32 bg-[#060606] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/4 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A84C]/4 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#10B981]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#10B981]/70">Intelligence</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#10B981]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Trading <span className="text-gradient-emerald">Intelligence</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-sm max-w-md mx-auto">
            Real-time market data meets institutional-grade analysis. This is how serious traders see the market.
          </p>
        </motion.div>

        {/* Dashboard grid */}
        <div className="space-y-6">
          {/* Top row: Price cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cryptoPrices.map((coin, i) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-sm p-5 relative overflow-hidden group cursor-pointer"
                style={{ border: `1px solid ${coin.color}15` }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: coin.color }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className="text-[10px] tracking-[0.3em] uppercase font-bold mb-1"
                      style={{ color: coin.color }}
                    >
                      {coin.symbol}
                    </div>
                    <div className="text-[10px] text-[#C0C0C0]/40 tracking-wider">{coin.name}</div>
                  </div>
                  <MiniChart positive={coin.positive} color={coin.color} />
                </div>
                <div
                  className="text-3xl font-light mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F8F8F8" }}
                >
                  $<AnimatedNumber value={coin.price} />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono ${coin.positive ? "text-[#10B981]" : "text-[#EF4444]"}`}
                  >
                    {coin.change}
                  </span>
                  <span className="text-[9px] text-[#C0C0C0]/30 tracking-wider">VOL {coin.volume}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* EMA Status */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-1 glass rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C0C0C0]/60">EMA Status</span>
                <span className="text-[9px] text-[#10B981] tracking-widest">BULLISH</span>
              </div>
              <div className="space-y-3">
                {emaData.map((ema) => (
                  <div key={ema.period} className="flex items-center justify-between">
                    <span className="text-xs text-[#C0C0C0]/50 font-mono">{ema.period}</span>
                    <span className="text-xs font-mono text-[#C0C0C0]/80">{ema.value}</span>
                    <span
                      className="text-[9px] tracking-wider px-2 py-0.5 rounded"
                      style={{ color: ema.color, background: ema.color + "15" }}
                    >
                      {ema.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sentiment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <SentimentMeter />
            </motion.div>

            {/* VIP Bias */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass-gold rounded-sm p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-[40px]" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/70">VIP Market Bias</span>
              </div>
              <div
                className="text-2xl font-light text-[#10B981] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Bullish
                <span className="text-base text-[#10B981]/60 ml-2">/ Short-Term</span>
              </div>
              <p className="text-xs text-[#C0C0C0]/50 leading-relaxed mb-4">
                BTC holding key EMA confluence. Institutional accumulation patterns visible on 4H. Watching $69.2K resistance break for continuation.
              </p>
              <div className="flex gap-2">
                {["Long Bias", "EMA Hold", "Watch $69.2K"].map((tag) => (
                  <span key={tag} className="text-[9px] tracking-wider px-2 py-1 bg-[#C9A84C]/10 text-[#C9A84C]/70 border border-[#C9A84C]/15 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <LiquidationZone />
            </motion.div>

            {/* Volume chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="glass rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C0C0C0]/60">BTC Volume — 7D</span>
                <span className="text-[9px] text-[#C9A84C]/70 font-mono">7-DAY</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.07 }}
                    className="flex-1 rounded-t"
                    style={{
                      background: i === 5 ? "linear-gradient(180deg, #C9A84C, #C9A84C80)" : "linear-gradient(180deg, #10B981, #10B98140)",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-[#C0C0C0]/30 font-mono tracking-wider">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
