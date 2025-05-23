/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono-cyber': ['Audiowide', 'monospace'],
        'code': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          pink: '#ff0080',
          cyan: '#00ffff',
          green: '#00ff41',
          yellow: '#ffff00',
          purple: '#8000ff',
          dark: '#0a0a0f',
          darker: '#050507',
          gray: '#1a1a2e',
        }
      },
      animation: {
        'flicker': 'flicker 0.15s infinite linear',
        'border-flow': 'border-flow 3s linear infinite',
      },
      keyframes: {
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, #ff0080, #00ffff, #00ff41, #ffff00)',
        'circuit-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}