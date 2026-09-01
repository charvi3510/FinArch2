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
        obsidian: {
          950: '#050607',
          900: '#0A0D0F',
          850: '#0F1317',
          800: '#141A1F',
          750: '#1A2127',
          700: '#222B32',
          600: '#323E48',
          500: '#4A5B68',
        },
        mint: {
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#00f59b',
          600: '#10b981',
          700: '#059669',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00e5ff',
          600: '#0284c7',
        },
        crimson: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'mint-glow': '0 0 20px -5px rgba(0, 245, 155, 0.25)',
        'cyan-glow': '0 0 20px -5px rgba(0, 229, 255, 0.25)',
        'crimson-glow': '0 0 20px -5px rgba(244, 63, 94, 0.25)',
      },
      letterSpacing: {
        'widest-tech': '0.15em',
      },
    },
  },
  plugins: [],
}
