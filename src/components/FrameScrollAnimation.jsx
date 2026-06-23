import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { profile } from "../data/profile";

const FrameScrollAnimation = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.0005 });

  const lidRotate     = useTransform(smooth, [0, 0.55], [-105, 0]);
  const laptopScale   = useTransform(smooth, [0, 0.55, 1], [0.72, 1, 1.35]);
  const laptopY       = useTransform(smooth, [0, 0.55, 1], [60, 0, -60]);
  const laptopRotateY = useTransform(smooth, [0, 0.55, 1], [-12, 0, 0]);
  const sceneOpacity  = useTransform(smooth, [0.88, 1], [1, 0]);
  const screenGlow    = useTransform(smooth, [0.25, 0.5, 0.65], [0, 0.25, 1]);
  const screenScan    = useTransform(smooth, [0.55, 1], [0, 1]);
  const contentOpacity= useTransform(smooth, [0.5, 0.7], [0, 1]);
  const keyboardLight = useTransform(smooth, [0.45, 0.65], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh] bg-[#020202]">
      <motion.div style={{ opacity: sceneOpacity }} className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* soft background spotlights */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:
            'radial-gradient(circle at 30% 35%, rgba(139,92,246,0.10), transparent 55%),' +
            'radial-gradient(circle at 70% 65%, rgba(34,211,238,0.08), transparent 55%)' }} />

        <motion.div
          style={{ scale: laptopScale, y: laptopY, rotateY: laptopRotateY, perspective: 1200 }}
          className="relative"
        >
          {/* under-laptop shadow */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-[80%] h-6 rounded-full blur-2xl bg-violet-500/25" />

          <div style={{ perspective: 1500 }} className="flex flex-col items-center">

            {/* LID */}
            <motion.div
              style={{ rotateX: lidRotate, transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
              className="relative w-[300px] sm:w-[420px] md:w-[520px] aspect-[16/10] -mt-[16px] md:-mt-[20px] mx-auto"
            >
              <div className="absolute inset-0 rounded-t-2xl p-[6px] md:p-[8px]"
                   style={{ background: 'linear-gradient(160deg,#2a2a32 0%,#0f0f13 60%,#06060a 100%)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.6)' }}>
                <div className="relative w-full h-full rounded-lg bg-black p-[5px]">
                  <div className="relative w-full h-full rounded-md overflow-hidden bg-[#02020a] flex items-center justify-center">

                    {/* glow gradient */}
                    <motion.div style={{ opacity: screenGlow }}
                      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.45),rgba(2,2,4,1)_75%)]" />

                    {/* scanlines */}
                    <motion.div style={{ opacity: screenScan }}
                      className="absolute inset-0 pointer-events-none mix-blend-overlay">
                      <motion.div className="w-full h-full"
                        animate={{ backgroundPositionY: ['0px', '14px'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)' }} />
                    </motion.div>

                    {/* corner UI */}
                    <motion.div style={{ opacity: screenGlow }}
                      className="absolute top-2 left-2 right-2 flex justify-between font-mono text-[7px] text-violet-400/60 tracking-widest">
                      <span>&gt; NEURAL_OS v3.1</span>
                      <span className="text-cyan-400/60">ONLINE</span>
                    </motion.div>

                    {/* center content */}
                    <motion.div style={{ opacity: screenGlow }} className="relative z-10 text-center px-4">
                      <p className="text-white font-black text-lg sm:text-2xl md:text-4xl tracking-tight uppercase mb-1.5 leading-none"
                         style={{ textShadow: '0 0 30px rgba(139,92,246,0.6)' }}>
                        {profile.name}
                      </p>
                      <p className="text-violet-400/80 font-mono text-[8px] sm:text-[10px] md:text-xs tracking-[0.4em] uppercase">
                        {profile.role}
                      </p>
                    </motion.div>

                    {/* reflection sweep */}
                    <motion.div style={{ opacity: screenGlow }}
                      className="absolute -inset-y-4 -left-1/3 w-1/2 rotate-12 pointer-events-none"
                      animate={{ x: ['0%', '260%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}>
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    </motion.div>

                    {/* webcam dot */}
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/15 ring-1 ring-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HINGE */}
            <div className="relative w-[300px] sm:w-[420px] md:w-[520px] h-[6px] md:h-[8px]"
                 style={{ background: 'linear-gradient(180deg,#1a1a20,#08080c)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 8px rgba(0,0,0,0.6)' }} />

            {/* BASE */}
            <div className="relative w-[330px] sm:w-[460px] md:w-[570px] h-[18px] md:h-[24px] rounded-b-2xl"
                 style={{ background: 'linear-gradient(180deg,#1d1d24 0%,#0a0a0e 100%)',
                          boxShadow: '0 14px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              {/* keyboard glow strip */}
              <motion.div style={{ opacity: keyboardLight }}
                className="absolute inset-x-6 top-1 h-[3px] rounded-full blur-[2px]"
              >
                <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(to right, rgba(139,92,246,0), rgba(139,92,246,0.6), rgba(34,211,238,0))' }} />
              </motion.div>
              {/* trackpad */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-[40%] h-[3px] rounded-sm bg-white/5" />
            </div>

          </div>
        </motion.div>

        {/* Reveal copy */}
        <motion.div style={{ opacity: contentOpacity }}
          className="absolute inset-x-0 bottom-[12%] text-center px-6 z-30 pointer-events-none">
          <h3 className="text-white text-3xl md:text-6xl font-black uppercase tracking-tighter mb-2">
            Welcome to my <span className="text-violet-400">Workspace</span>
          </h3>
          <p className="text-gray-500 font-mono tracking-[0.5em] uppercase text-[10px]">Scroll to enter</p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default FrameScrollAnimation;
