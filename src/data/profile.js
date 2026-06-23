// ============================================================
// SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
// Edit this file to update anything on the site — name, bio,
// projects, links, the AI Twin intro script, etc.
// ============================================================

export const profile = {
  name: "Mansaa Kohli",
  initials: "MK",
  role: "AI/ML Engineer",
  tagline:
    "I build deployed AI systems, not just notebooks — from LLM-powered apps to real-time multi-agent games.",
  email: "mansaakohli1502@gmail.com",
  github: "https://github.com/mansaakohli15",
  linkedin: "https://linkedin.com/in/mansaa-kohli-937868289",
};

export const about = {
  eyebrow: "SYSTEM INFO",
  heading: "About Me",
  bio: "I'm a final-year B.Tech student specialising in Artificial Intelligence & Machine Learning at VIT Bhopal. I care about working, deployed systems over theoretical exercises — I've shipped RAG pipelines, adaptive interview engines, real-time multi-agent LLM games, and privacy-first computer vision tools end to end. I also co-authored a research paper accepted for oral presentation at an international AI conference.",
  cards: [
    {
      title: "Focus",
      desc: "Machine Learning, LLM Applications, Full-Stack AI Systems",
    },
    {
      title: "Education",
      desc: "B.Tech, AI & Machine Learning — VIT Bhopal University",
    },
    {
      title: "Research",
      desc: "Co-author, oral presentation at ICAAIC 2025",
    },
  ],
  tools: [
    "Python",
    "React / Next.js",
    "LangChain",
    "Groq LLaMA",
    "TensorFlow.js",
    "Java Spring Boot",
    "PostgreSQL",
    "Git",
  ],
};

export const capabilities = [
  {
    title: "ML & Model Building",
    p: "Classification & regression pipelines with Scikit-learn — feature engineering, evaluation, and clear reporting on what the model actually learned.",
  },
  {
    title: "LLM & RAG Systems",
    p: "Retrieval-augmented applications and agentic systems using LangChain, Groq LLaMA, and structured-output prompting for reliable, grounded answers.",
  },
  {
    title: "Real-Time & Multiplayer",
    p: "WebSocket and Supabase Realtime architectures for live, multi-user experiences — rooms, roles, and synchronized state.",
  },
  {
    title: "Computer Vision",
    p: "In-browser, privacy-first inference with TensorFlow.js and OpenCV — no data ever leaves the device.",
  },
];

export const research = {
  title: "Research",
  badge: "ICAAIC 2025 — Oral Presentation",
  org: "4th Int'l Conference on Applied AI & Computing",
  desc: "Co-authored a paper benchmarking LightGBM against deep learning models for clinical diabetes-onset prediction — covering preprocessing, EDA, model training, and comparative evaluation across accuracy, precision, recall, F1, and AUC-ROC.",
  cta: "View Abstract",
  url: "https://www.semanticscholar.org/paper/Clinical-Decision-Support-Through-Machine-Learning%3A-Mittal-JasmineSelvakumariJeya/5c24806466a60afd837f1b27bce93d551e9618f5",
};

export const projects = [
  {
    title: "MafiaMind",
    status: "Live",
    tags: ["React 19", "TanStack Start", "Supabase", "Gemini 3"],
    desc: "Real-time multiplayer social-deduction game for up to 8 players, with autonomous AI players powered by Gemini 3 — each running structured suspicion-scoring across 10 distinct personas to drive in-character chat and voting.",
    highlight: "Postgres RLS + trigger-based access control · Realtime channels",
    accent: "violet",
    image: "/projects/mafiamind.png",
    link: "https://mafia-mind.vercel.app/",
    github: "https://github.com/mansaakohli15/mafia-mind",
  },
  {
    title: "Launchpad",
    status: "Live",
    tags: ["Next.js", "FastAPI", "Groq LLaMA 3.3 70B", "LangChain"],
    desc: "Full-stack AI career-prep platform: ATS resume scoring & rewriting, a 5-round adaptive mock interview engine with voice input, a RAG knowledge assistant over your own notes, and a personalised week-by-week prep roadmap.",
    highlight: "Frontend on Vercel · Backend on Railway",
    accent: "cyan",
    image: "/projects/launchpad.png",
    link: "https://launchpad-smoky-ten.vercel.app",
    github: "https://github.com/mansaakohli15/launchpad",
  },
  {
    title: "SafeWalk",
    status: "3rd Place — Hackathon",
    tags: ["TensorFlow.js", "React", "Next.js"],
    desc: "Real-time fall-detection app for elderly users. Pose estimation runs fully in-browser — no webcam frame ever leaves the device — built for a 250+ team national hackathon.",
    highlight: "Privacy-first, fully in-browser inference",
    accent: "emerald",
    image: "/projects/safewalk.svg",
    link: "#",
    github: "https://github.com/Ali-Zoya/SafeWalk-WebApp",
  },
];

export const achievements = [
  { label: "3rd Place", detail: "CodeVerse Hackathon, 250+ teams" },
  { label: "Oral Presentation", detail: "ICAAIC 2025 international conference" },
  { label: "150+ Problems", detail: "Solved on LeetCode" },
];

// ============================================================
// AI TWIN — voice intro script (Web Speech API, free, no key)
// Edit this paragraph any time to change what the twin says.
// ============================================================
export const aiTwinScript = `Hello, I am Mansaa Kohli. I'm a final-year AI and Machine Learning student at VIT Bhopal, and I'd rather ship a working product than write another notebook. I've built a real-time multiplayer game with autonomous LLM agents, an AI career-prep platform with adaptive mock interviews, and a privacy-first fall-detection tool that runs entirely in the browser. I also co-authored a research paper presented at an international AI conference. Scroll down to see my work, or just ask my AI twin a question down in the contact section.`;

export const aiTwin = {
  label: "AI Twin",
  subtitle: "Hear it from her digital counterpart",
  avatarSrc: "/avatar/ai-twin.png",
};
