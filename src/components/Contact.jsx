import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiActivity, FiMail, FiCpu } from "react-icons/fi";
import { drawNeuralField } from "../utils/neuralField";
import { profile } from "../data/profile";
import { useAITwinChat } from "../hooks/useAITwinChat";

// Contact section — no scroll pin, chat appears immediately when reached.
// Neural canvas runs autonomously on a time-based loop (not scroll-scrubbed).
const Contact = () => {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const scrollRef    = useRef(null);
  const inputRef     = useRef(null);

  const [visible, setVisible] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [input, setInput]     = useState("");
  const { messages, send, loading } = useAITwinChat();

  // Neural canvas — time-driven, not scroll-driven
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.clientWidth  * Math.min(window.devicePixelRatio || 1, 2);
      canvas.height = canvas.clientHeight * Math.min(window.devicePixelRatio || 1, 2);
    };
    window.addEventListener("resize", resize);
    resize();

    let start = null;
    let raf;
    const loop = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 8000; // slow autonomous drift
      drawNeuralField(ctx, canvas.width, canvas.height, 0.8, {
        accent: "34,211,238",
        accent2: "139,92,246",
        converge: true,
        time: t * 10,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Reveal neural field immediately, chat after 1.4s transition
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          setTimeout(() => setChatReady(true), 1400);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (text) => {
    const val = (text ?? input).trim();
    if (!val || loading) return;
    send(val);
    setInput("");
  };

  const SUGGESTIONS = ["What have you built?", "What are you good at?", "How can I reach you?"];

  return (
    <section
      ref={containerRef}
      id="contactme"
      className="relative w-full min-h-screen bg-[#06040e] overflow-hidden flex items-center justify-center py-20 px-6"
    >
      {/* Neural canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 object-cover opacity-90" />

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(6,4,14,0.55) 100%)' }}/>

      {/* HUD corners */}
      <div className="absolute top-10 left-10 z-[5] pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400/50 font-mono text-[9px] tracking-[0.5em] uppercase">
          <FiActivity size={10} className="animate-pulse"/>
          <span>Signal_Stable</span>
        </div>
      </div>

      {/* Neural convergence flash — shows for 1.4s before chat appears */}
      <AnimatePresence>
        {visible && !chatReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-[8] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <p className="font-mono text-[10px] text-cyan-400/70 tracking-[0.6em] uppercase animate-pulse mb-3">
                &gt; ESTABLISHING CONNECTION
              </p>
              <div className="flex gap-1.5 justify-center">
                {[0,1,2,3,4].map(i => (
                  <span key={i} className="w-1 h-1 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}/>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat content — appears after neural transition */}
      <AnimatePresence>
        {chatReady && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                ASK MY <span className="text-cyan-400">AI TWIN</span>
              </h2>
              <p className="text-gray-500 font-mono text-[10px] tracking-[0.5em] uppercase">
                Protocol: Direct_Inquiry
              </p>
            </div>

            {/* Chat window */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                  <FiCpu size={14}/>
                </div>
                <div className="flex-1">
                  <p className="text-white text-[11px] font-bold uppercase tracking-widest">Mansaa's AI Twin</p>
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[9px]">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/>
                    Online
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="h-[300px] overflow-y-auto px-5 py-5 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center gap-5">
                    <p className="text-gray-500 text-xs text-center">
                      Ask me anything about Mansaa's projects, skills, or background.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => handleSend(s)}
                                className="text-[10px] font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-accent/40 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed font-sans ${
                      m.role === "user"
                        ? "bg-accent text-white rounded-br-sm"
                        : `bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm ${m.isError ? "border-amber-500/30" : ""}`
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex items-center gap-3 px-4 py-4 border-t border-white/10">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a question…"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white text-[12px] font-sans outline-none focus:border-accent/50 transition-colors placeholder:text-gray-600"
                />
                <button type="submit" disabled={loading || !input.trim()}
                        className="w-10 h-10 shrink-0 rounded-full bg-cyan-600 text-black flex items-center justify-center disabled:opacity-30 hover:bg-cyan-500 transition-colors">
                  <FiSend size={14}/>
                </button>
              </form>
            </div>

            {/* Email fallback */}
            <div className="text-center mt-6">
              <a href={`mailto:${profile.email}`}
                 className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-cyan-400 transition-colors">
                <FiMail size={11}/> Prefer email? {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;