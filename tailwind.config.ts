import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      colors: {
        background: 'hsl(35 33% 97%)',
        foreground: 'hsl(20 10% 10%)',
        accent: {
          DEFAULT: 'hsl(35 60% 55%)',
          light: 'hsl(35 70% 70%)',
          dark: 'hsl(35 50% 40%)',
        },
        neutral: {
          50: 'hsl(35 40% 98%)',
          100: 'hsl(35 33% 97%)',
          200: 'hsl(35 25% 90%)',
          300: 'hsl(30 20% 85%)',
          400: 'hsl(20 15% 70%)',
          500: 'hsl(20 12% 50%)',
          600: 'hsl(20 10% 35%)',
          700: 'hsl(20 8% 20%)',
          800: 'hsl(20 10% 12%)',
          900: 'hsl(20 10% 10%)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
