import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiCpu,
  FiMessageSquare,
  FiZap,
  FiEye,
  FiFileText,
} from "react-icons/fi";
import { capabilities, research, achievements } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

const icons = [<FiCpu size={24} />, <FiMessageSquare size={24} />, <FiZap size={24} />, <FiEye size={24} />];

export default function Services() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(headerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "none", stagger: 0.1 }
      );

      tl.fromTo(".service-card",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.3, ease: "none", stagger: 0.1 },
        "-=0.2"
      );

      tl.fromTo(sidebarRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "none" },
        "-=0.3"
      );

      tl.fromTo(".corner-line",
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "none", stagger: 0.05 },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-[#000] text-white overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div ref={headerRef} className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <div className="inline-block px-3 py-1 border border-accent/30 bg-accent/5 rounded-sm mb-4">
          <p className="text-accent/80 font-mono text-[10px] uppercase tracking-[0.5em]">CAPABILITIES MODULE</p>
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
          What I Do<span className="text-accent">.</span>
        </h2>
        <div className="w-24 h-[1px] bg-accent/40 mx-auto mb-8"></div>
        <p className="max-w-3xl mx-auto text-gray-500 font-light text-base leading-relaxed">
          Four areas I keep coming back to — usually combined, in projects I actually ship and deploy.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">

        <div ref={gridRef} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((service, i) => (
            <div
              key={service.title}
              className="service-card group p-10 bg-[#0a0a0a] border border-white/[0.05] hover:border-accent/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)] transition-all duration-300 rounded-sm cursor-default flex flex-col items-start"
            >
              <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-sm text-gray-300 group-hover:text-accent/80 group-hover:border-accent/20 transition-all">
                {icons[i]}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight uppercase">{service.title}</h3>
              <p className="text-gray-500 font-light text-sm leading-relaxed">
                {service.p}
              </p>
            </div>
          ))}
        </div>

        {/* Research sidebar */}
        <div ref={sidebarRef} className="lg:col-span-4 h-full relative">
          <div className="sticky top-32 p-10 bg-[#0c0c0c] border border-white/[0.08] rounded-sm group overflow-hidden">

            <div className="corner-line absolute top-2 left-2 w-4 h-4 border-t border-l border-accent/50"></div>
            <div className="corner-line absolute top-2 right-2 w-4 h-4 border-t border-r border-accent/50"></div>
            <div className="corner-line absolute bottom-2 left-2 w-4 h-4 border-b border-l border-accent/50"></div>
            <div className="corner-line absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent/50"></div>

            <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/5 blur-[80px] group-hover:bg-accent/10 transition-all duration-1000" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-sm text-accent/80">
                  <FiFileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-widest uppercase">{research.title}</h3>
                  <span className="text-[8px] font-mono text-gray-600 block tracking-[0.4em] mt-1">MODULE ACTIVE</span>
                </div>
              </div>

              <div className="mb-6">
                <a
                  href={research.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full px-3 py-2 bg-white items-center justify-center rounded-sm hover:bg-violet-200 transition-colors"
                >
                  <span className="text-black font-black text-[10px] tracking-tight leading-snug">{research.badge}</span>
                </a>
              </div>

              <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-4">{research.org}</p>

              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                {research.desc}
              </p>

              <a
                href={research.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent/80 hover:text-accent/60 transition-colors mb-10"
              >
                {research.cta} →
              </a>

              <div className="mt-auto space-y-6">
                <div className="space-y-3">
                  {achievements.map((a) => (
                    <div key={a.label} className="flex items-center gap-3 text-[11px] font-mono">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                      <span className="text-white font-bold">{a.label}</span>
                      <span className="text-gray-600">— {a.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center font-mono text-[9px] text-gray-700 tracking-[0.2em] px-2 opacity-50">
            <span>&gt; SYSTEM DATA LOADED</span>
            <span>0x034FB</span>
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/[0.03] z-10"></div>
      <div className="absolute top-0 right-1/2 w-[1px] h-full bg-white/[0.03] z-10"></div>
    </section>
  );
}
