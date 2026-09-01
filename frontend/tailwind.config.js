/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finarch: {
          bg: '#070b14', // deepest space navy
          card: '#0f172a', // panel navy
          cardBorder: '#1e293b',
          subtle: '#334155',
          accent: '#06b6d4', // cyan glow
          blue: '#3b82f6', // electric blue
          purple: '#8b5cf6', // neon purple
          emerald: '#10b981', // positive wealth
          amber: '#f59e0b', // warning
          rose: '#f43f5e', // danger
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(139, 92, 246, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'card-elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
