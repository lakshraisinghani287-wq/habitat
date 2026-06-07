/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07080d',
          900: '#0b0d14',
          800: '#10131c',
          700: '#161a26',
          600: '#1d2233',
          500: '#262b3d',
        },
        neon: {
          mint: '#5eead4',
          cyan: '#22d3ee',
          violet: '#a78bfa',
          pink: '#f472b6',
          amber: '#fbbf24',
          lime: '#a3e635',
          rose: '#fb7185',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(94,234,212,0.5)' }, '50%': { boxShadow: '0 0 30px 6px rgba(94,234,212,0.0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        rise: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        rise: 'rise 0.4s ease-out both',
        spinSlow: 'spinSlow 20s linear infinite',
      },
      boxShadow: {
        glow: '0 0 24px rgba(94,234,212,0.25)',
        glowViolet: '0 0 24px rgba(167,139,250,0.25)',
      },
    },
  },
  plugins: [],
}
