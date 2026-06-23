import React from "react";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";
import { projects } from "../data/profile";

const accentMap = {
  violet: { from: "139,92,246", to: "59,7,100", text: "text-accent/60", border: "hover:border-accent/40", glow: "group-hover:bg-accent/20" },
  cyan: { from: "34,211,238", to: "8,51,68", text: "text-cyan-300", border: "hover:border-cyan-500/40", glow: "group-hover:bg-cyan-500/20" },
  emerald: { from: "52,211,153", to: "6,78,59", text: "text-emerald-300", border: "hover:border-emerald-500/40", glow: "group-hover:bg-emerald-500/20" },
};

// Generated abstract card art — deterministic per project, no stock imagery
function ProjectArt({ title, accent }) {
  const a = accentMap[accent] || accentMap.violet;
  const seed = title.length;
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${20 + seed * 4}% ${30 + seed * 3}%, rgba(${a.from},0.35), transparent 60%), linear-gradient(135deg, rgba(${a.from},0.12), rgba(${a.to},0.6))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <span
        className="absolute -bottom-6 -right-2 text-[8rem] font-black select-none leading-none opacity-[0.08]"
        style={{ color: `rgb(${a.from})` }}
      >
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

const Portfolio = () => {
  return (
    <section id="projects" className="bg-[#020202] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-accent font-mono tracking-[0.4em] uppercase text-[10px] mb-4"
        >
          Project Showcase
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tighter"
        >
          Selected Works<span className="text-accent">.</span>
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project, index) => {
          const a = accentMap[project.accent] || accentMap.violet;
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 ${a.border} transition-colors`}
            >
              <div className="relative overflow-hidden aspect-[4/3] rounded-[1.5rem] m-2">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                ) : (
                  <ProjectArt title={project.title} accent={project.accent} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className={`absolute inset-0 bg-black/0 ${a.glow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <span className="absolute top-4 left-4 max-w-[80%] text-[9px] font-mono uppercase tracking-widest px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white border border-white/10 truncate">
                  {project.status}
                </span>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">{project.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-4">{project.desc}</p>
                <p className={`text-[10px] font-mono uppercase tracking-widest mb-6 ${a.text}`}>{project.highlight}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] uppercase tracking-widest font-mono px-3 py-1 bg-white/10 text-gray-300 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="Github Repository" className="p-3 bg-white/5 text-white rounded-xl hover:bg-accent transition-all border border-white/10">
                    <FiGithub size={20} />
                  </a>
                  {project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="Live Demo" className="p-3 bg-white/5 text-white rounded-xl hover:bg-accent transition-all border border-white/10">
                      <FiExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Portfolio;
