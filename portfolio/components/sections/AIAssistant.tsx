"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "How does Osmaan analyze markets?",
  "What mindset keeps traders poor?",
  "How should beginners start crypto?",
  "What does wealth mean beyond money?",
  "What is 10x Limitless?",
  "How does tawakkul relate to trading?",
];

const responses: Record<string, string> = {
  "How does Osmaan analyze markets?":
    "Osmaan starts every analysis from the macro — monthly and weekly timeframes first. He looks for institutional order flow signals: where is the liquidity? What levels have smart money been engineering hunts around? He then overlays EMAs (20, 50, 200) on the 4H and 1H to confirm or deny the bias. Volume, market structure breaks, and key psychological price levels complete the picture. He never trades setups — he reads narratives.",
  "What mindset keeps traders poor?":
    "Three things above all else: (1) Trading to be right instead of trading to be profitable — these are not the same. (2) Emotional attachment to positions. When you're emotionally attached, you don't close losing trades, you 'wait for them to come back.' (3) Lack of a written process. If your strategy isn't documented, it doesn't exist — you're just gambling with extra steps. Fix the mindset. The profits follow.",
  "How should beginners start crypto?":
    "Step one: Don't trade. Paper trade for 90 days. Learn to read charts, understand market structure, and develop patience. Step two: Master one asset deeply before touching anything else. BTC is the teacher. Step three: Understand risk management before entry strategy. Most beginners are obsessed with entries. Professionals are obsessed with exits and position sizing. Step four: Find a mentor or community that holds you accountable. Learning alone is the slowest path.",
  "What does wealth mean beyond money?":
    "Money is a tool. Wealth is freedom — freedom of time, location, thought, and contribution. True wealth is waking up with no obligation that you didn't choose. It's having the capacity to help people in ways that change their trajectory. Osmaan's definition: when your income exceeds your obligations and your impact outlasts your presence.",
  "What is 10x Limitless?":
    "10x Limitless is a premium private community for serious traders and entrepreneurs. Not a signals group. Not a hype machine. It's an intelligence network — daily market analysis, mindset frameworks, accountability, and direct access to Osmaan's insights. The name comes from the belief that most people are operating at a fraction of their potential. 10x is not the ceiling — it's the starting point.",
  "How does tawakkul relate to trading?":
    "This is one of the most powerful intersections Osmaan has discovered. Tawakkul — complete reliance on Allah after taking all available action — is the exact state elite traders call 'process-focus.' You analyse with full effort. You plan the trade with precision. You execute with discipline. And then — you release the outcome. You stop checking the chart every five minutes. You let the market do what it will. The psychological freedom this brings is extraordinary. Many traders 'know' tawakkul but haven't applied it to their craft.",
};

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "As-salamu alaykum. I'm Osmaan's AI. Ask me anything about trading, mindset, the journey, or the vision behind 10x Limitless.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response =
        responses[text] ||
        "That's a profound question. Osmaan's answer would begin with self-awareness — understanding your own psychology, your inherited beliefs about money, and your relationship with risk. Everything else is technique, and technique can be taught. The inner work cannot be skipped.";
      const aiMsg: Message = { id: Date.now() + 1, role: "assistant", content: response };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200 + Math.random() * 600);
  };

  return (
    <section id="ai" className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#10B981]/4 rounded-full blur-[200px] -translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#10B981]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#10B981]/70">AI Interface</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#10B981]" />
          </div>
          <h2
            className="text-5xl lg:text-7xl font-light text-white/90 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ask <span className="text-gradient-gold">Osmaan AI</span>
          </h2>
          <p className="text-[#C0C0C0]/50 text-sm max-w-md mx-auto">
            Distilled insights from years of trading, building, and studying. Ask anything.
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-sm overflow-hidden"
          style={{ border: "1px solid rgba(201,168,76,0.15)" }}
        >
          {/* Chat header */}
          <div
            className="px-6 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] flex items-center justify-center text-[#050505] font-bold text-xs">
                  O
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#0D0D0D]" />
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Osmaan AI</p>
                <p className="text-[9px] text-[#10B981] tracking-wider">Online — Powered by 10x Intelligence</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-4 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-sm text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#C9A84C]/15 text-white/80 border border-[#C9A84C]/20"
                        : "bg-white/3 text-[#C0C0C0]/80 border border-white/5"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="px-4 py-3 bg-white/3 border border-white/5 rounded-sm flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-[#C9A84C]/60 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div
            className="px-6 py-3 border-t flex gap-2 overflow-x-auto"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-[9px] tracking-wider px-3 py-1.5 border border-[#C9A84C]/15 text-[#C9A84C]/60 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-200 rounded whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="px-6 py-4 border-t flex gap-3"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-sm text-white/70 placeholder-[#C0C0C0]/20 outline-none border-b border-[#C9A84C]/20 pb-1 focus:border-[#C9A84C]/50 transition-colors duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              className="px-4 py-2 bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider hover:bg-[#C9A84C]/30 transition-all disabled:opacity-30 rounded-sm"
            >
              Send
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
