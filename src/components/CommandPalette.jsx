import React, { useEffect, useRef, useState } from "react";
import { FiCommand, FiGithub, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import { profile } from "../data/profile";

const commands = [
  { label: "Go to About", action: (nav) => nav("#about") },
  { label: "Go to Capabilities", action: (nav) => nav("#services") },
  { label: "Go to Projects", action: (nav) => nav("#projects") },
  { label: "Go to Contact", action: (nav) => nav("#contactme") },
  { label: "Open GitHub", icon: <FiGithub />, action: () => window.open(profile.github, "_blank") },
  { label: "Open LinkedIn", icon: <FiLinkedin />, action: () => window.open(profile.linkedin, "_blank") },
  { label: "Copy Email", icon: <FiMail />, action: () => navigator.clipboard?.writeText(profile.email) },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Hint pill, bottom-right, desktop only */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed bottom-8 right-8 z-[150] items-center gap-2 px-4 py-2 bg-black/80 border border-white/20 rounded-full backdrop-blur-md text-gray-300 hover:text-white hover:border-accent/70/60 hover:bg-black/90 transition-all font-mono text-[10px] tracking-widest uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <FiCommand size={12} />
        <span>Press / to navigate</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[18vh] px-6 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <FiCommand className="text-accent/80" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-gray-600 font-mono"
              />
              <span className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">esc</span>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <div className="px-5 py-6 text-gray-600 text-sm font-mono">No matches.</div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.label}
                  onClick={() => c.action(navigate)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left text-gray-300 hover:bg-accent/10 hover:text-white transition-colors font-mono text-sm"
                >
                  <span className="flex items-center gap-3">
                    {c.icon}
                    {c.label}
                  </span>
                  <FiArrowRight className="opacity-0 group-hover:opacity-100" size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
