import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import { drawNeuralField } from '../utils/neuralField';
import { profile } from '../data/profile';
import RobotHead from './RobotHead';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const progRef = useRef({ p: 0 });


  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.clientWidth  * Math.min(window.devicePixelRatio || 1, 2);
      canvas.height = canvas.clientHeight * Math.min(window.devicePixelRatio || 1, 2);
    };
    window.addEventListener('resize', resize);
    resize();

    let raf;
    const loop = () => {
      drawNeuralField(ctx, canvas.width, canvas.height, progRef.current.p, {
        accent:  '139,92,246',
        accent2: '34,211,238',
        converge: progRef.current.p > 0.55,
        time: progRef.current.p * 10,
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    // ── Boot sequence ──
    const boot = gsap.timeline({ delay: 0.15 });
    boot.fromTo('.h-glow',   { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'power1.inOut' }, 0);
    boot.fromTo('nav',       { y: -36, opacity: 0 },      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.35);
    boot.fromTo(canvas,      { opacity: 0 },              { opacity: 1, duration: 1.3 }, 0.4);
    boot.to(progRef.current, { p: 0.05, duration: 1.1, ease: 'power1.inOut' }, 0.4);
    boot.fromTo('.h-hud',    { opacity: 0 },              { opacity: 1, duration: 0.07, stagger: 0.08 }, 0.95);
    boot.fromTo('.h-robot',  { opacity: 0, scale: 0.9, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 1.05);
    boot.fromTo('.h-role',   { opacity: 0, y: 12 },       { opacity: 1, y: 0, duration: 0.45 }, 1.9);
    boot.fromTo('.h-social', { opacity: 0, x: -8 },       { opacity: 1, x: 0, duration: 0.2, stagger: 0.1 }, 2.3);

    // ── Scroll pin + fade ──
    const stl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2800',
        scrub: 0.55,
        pin: true,
        anticipatePin: 1,
      },
    });
    stl.to(progRef.current, { p: 1, ease: 'none', onUpdate: () => {} });
    stl.fromTo('.h-all', { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(10px)', duration: 0.1 }, 0.87);
    stl.fromTo(canvas,   { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.87);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className="h-all relative w-full h-screen bg-[#08060f] overflow-hidden"
    >
      {/* Boot screen */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#08060f]">
          <p className="text-gray-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-4">
            &gt; BOOT SEQUENCE INITIATED
          </p>
          <div className="w-48 h-[1px] bg-white/10">
            <div className="h-full bg-accent animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Neural canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-0" />

      {/* Subtle grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Ambient violet glow */}
      <div className="h-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[65vw] h-[65vw] max-w-3xl max-h-3xl rounded-full z-[2] pointer-events-none opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)' }}
      />

      {/* PORTFOLIO ghost wordmark — behind robot, now visible */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-black uppercase tracking-tighter leading-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(5rem, 20vw, 18rem)',
            color: 'rgba(139,92,246,0.04)',
            WebkitTextStroke: '1.5px rgba(139,92,246,0.22)',
            textShadow: '0 0 120px rgba(139,92,246,0.08)',
          }}
        >
          PORTFOLIO
        </span>
      </div>

      {/* HUD top-left — no location */}
      <div className="h-all absolute top-24 left-8 md:left-12 z-[10] font-mono text-[9px] text-accent/70 tracking-[0.4em] flex flex-col gap-1.5 pointer-events-none">
        <span className="h-hud opacity-0">&gt; SYSTEM ONLINE</span>
        <span className="h-hud opacity-0">&gt; AI/ML ENGINEER · VIT BHOPAL</span>
        <span className="h-hud opacity-0">&gt; NEURAL LINK ACTIVE</span>
      </div>
      <div className="h-all absolute bottom-10 right-8 md:right-12 z-[10] font-mono text-[9px] text-gray-600 tracking-[0.3em] text-right pointer-events-none">
        <span className="h-hud opacity-0 block">SYS_ID: MK_PORTFOLIO</span>
      </div>

      {/* Social icons */}
      <div className="h-all absolute bottom-10 left-8 md:left-12 z-[10] flex flex-col gap-5">
        <a href={profile.github} target="_blank" rel="noreferrer"
           className="h-social opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_10px_rgba(139,92,246,1)] transition-all">
          <FiGithub size={18} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"
           className="h-social opacity-0 text-gray-500 hover:text-white hover:drop-shadow-[0_0_10px_rgba(139,92,246,1)] transition-all">
          <FiLinkedin size={18} />
        </a>
      </div>

      {/* Main layout — robot top, role + twin card bottom */}
      <AnimatePresence>
        {ready && (
          <div className="h-all absolute inset-0 z-[20] flex flex-col items-center justify-between pointer-events-none pt-16 pb-10 px-6">

            {/* Robot — takes up most of the vertical space */}
            <div className="h-robot opacity-0 flex-1 flex items-center justify-center w-full max-w-[340px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[560px]">
              <RobotHead className="w-full h-full" />
            </div>

            {/* Bottom bar: role label centered */}
            <div className="w-full max-w-5xl flex items-end justify-center gap-6 px-2 md:px-8">
              <div className="h-role opacity-0">
                <div className="relative inline-block pb-2">
                  <p className="font-mono text-[10px] sm:text-xs md:text-sm text-gray-300 tracking-[0.4em] uppercase">
                    {profile.role}
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40" />
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}