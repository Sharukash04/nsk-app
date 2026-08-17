/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nsk: {
          bg: '#121216',
          surface: '#1a1a20',
          surface2: '#232329',
          border: '#302f38',
          crimson: '#7c6cf6',
          crimson2: '#9b8dfa',
          crimsonDim: '#463f8f',
          ink: '#f0eef7',
          muted: '#8f8b9c',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124,108,246,0.45)',
        card: '0 4px 24px -8px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'nsk-radial': 'radial-gradient(circle at 20% -10%, rgba(124,108,246,0.20), transparent 55%), radial-gradient(circle at 85% 0%, rgba(79,140,255,0.12), transparent 45%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(124,108,246,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(124,108,246,0)' } },
      },
    },
  },
  plugins: [],
}
