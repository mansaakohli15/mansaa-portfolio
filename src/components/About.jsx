import React from 'react';
import { FiCode, FiBookOpen, FiAward } from "react-icons/fi";
import { SiReact, SiPython, SiTailwindcss, SiPostgresql, SiGit, SiTensorflow } from "react-icons/si";
import { about } from "../data/profile";

const iconMap = { Focus: <FiCode size={20} />, Education: <FiBookOpen size={20} />, Research: <FiAward size={20} /> };

const orbitIcons = [
  { icon: <SiPython size={18} />, label: "Python" },
  { icon: <SiReact size={18} />, label: "React" },
  { icon: <SiTensorflow size={18} />, label: "TensorFlow.js" },
  { icon: <SiPostgresql size={18} />, label: "PostgreSQL" },
  { icon: <SiGit size={18} />, label: "Git" },
  { icon: <SiTailwindcss size={18} />, label: "Tailwind" },
];

const toolIcons = {
  "Python": <SiPython size={22} />,
  "React / Next.js": <SiReact size={22} />,
  "LangChain": <FiCode size={22} />,
  "Groq LLaMA": <FiCode size={22} />,
  "TensorFlow.js": <SiTensorflow size={22} />,
  "Java Spring Boot": <FiCode size={22} />,
  "PostgreSQL": <SiPostgresql size={22} />,
  "Git": <SiGit size={22} />,
};

// Orbiting skill icon, positioned via CSS animation around a circle
function OrbitIcon({ children, label, radius, duration, delay, reverse }) {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        animation: `${reverse ? "orbit-reverse" : "orbit"} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        // orbit radius is encoded via a CSS variable consumed in the keyframes below
        // clamp() keeps icons from overflowing narrow mobile viewports
        ['--orbit-radius']: radius,
      }}
    >
      <div
        className="group relative flex items-center justify-center w-9 h-9 -ml-[18px] -mt-[18px] rounded-full bg-black/70 border border-accent/30 text-accent/60 backdrop-blur-md hover:border-accent/70 hover:text-white transition-colors"
        style={{ animation: `${reverse ? "spin-reverse" : "spin"} ${duration}s linear infinite`, animationDelay: `${delay}s` }}
      >
        {children}
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-widest text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div id="about" className="relative w-full min-h-screen bg-[#020202] overflow-hidden flex items-center justify-center font-sans tracking-wide py-20 px-6 md:px-12">

      <style>{`
        @keyframes orbit { from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); } to { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); } }
        @keyframes orbit-reverse { from { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); } to { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes spin-reverse { from { transform: rotate(-360deg); } to { transform: rotate(0deg); } }
      `}</style>

      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      <div className="relative z-[50] w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

        {/* AI Twin portrait with orbiting icons */}
        <div className="shrink-0 flex flex-col items-center gap-6">
          <div className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/10" />

            {/* Orbiting tech icons */}
            {orbitIcons.map((item, i) => (
              <OrbitIcon
                key={item.label}
                label={item.label}
                radius="clamp(95px, 28vw, 150px)"
                duration={18 + i * 2}
                delay={-i * 3}
                reverse={i % 2 === 0}
              >
                {item.icon}
              </OrbitIcon>
            ))}

            <img
              src="/avatar/ai-twin.png"
              alt="Mansaa Kohli"
              className="relative z-10 w-[78%] h-[78%] object-cover rounded-full border-2 border-white/10"
            />

            <span className="absolute bottom-3 right-3 z-20 w-4 h-4 rounded-full border-2 border-black bg-emerald-500" />
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col space-y-10 pointer-events-auto">
          <div className="space-y-2">
            <p className="text-accent font-mono text-[10px] uppercase tracking-[0.5em]">{about.eyebrow}</p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase">
              {about.heading}<span className="text-accent">.</span>
            </h2>
          </div>

          <p className="text-gray-400 text-sm md:text-md lg:text-xl font-light leading-relaxed max-w-2xl">
            {about.bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.cards.map((item) => (
              <div key={item.title} className="group p-6 bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 rounded-xl">
                <div className="text-accent mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  {iconMap[item.title] || <FiCode size={20} />}
                </div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-1">{item.title}</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">Core Tech Stack</h4>
            <div className="flex flex-wrap gap-5">
              {about.tools.map((tool) => (
                <div key={tool} className="group relative p-4 bg-black/50 border border-white/5 hover:border-accent/50 transition-all rounded-xl flex items-center justify-center cursor-help">
                  <div className="text-gray-500 group-hover:text-accent/80 transition-colors">
                    {toolIcons[tool] || <FiCode size={22} />}
                  </div>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] font-mono py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[70] whitespace-nowrap shadow-xl">
                    {tool}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
