/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent:  { DEFAULT: '#8B5CF6', soft: 'rgba(139,92,246,0.15)', mid: 'rgba(139,92,246,0.4)' },
        accent2: { DEFAULT: '#22D3EE', soft: 'rgba(34,211,238,0.12)' },
      },
      fontFamily: {
        sans:    ['Space Grotesk','system-ui','sans-serif'],
        mono:    ['Space Mono','monospace'],
        display: ['Space Grotesk','sans-serif'],
      },
      boxShadow: {
        accent:  '0 0 30px rgba(139,92,246,0.35)',
        accent2: '0 0 30px rgba(34,211,238,0.25)',
      },
    },
  },
  plugins: [],
}
