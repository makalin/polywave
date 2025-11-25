/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          green: '#00ff00',
          blue: '#0080ff',
          purple: '#8000ff',
          dark: '#0a0a0a',
          darker: '#050505',
        },
      },
      fontFamily: {
        pixel: ['Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'glow-magenta': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'glow-yellow': '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffff00',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

