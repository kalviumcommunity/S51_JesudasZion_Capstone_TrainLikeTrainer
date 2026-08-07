/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ground: '#14120F',
        surface: '#1C1917',
        surfaceHi: '#232019',
        line: '#2B2723',
        lineHi: '#3A332C',
        chalk: '#FAF7F0',
        chalkDim: '#A89C8D',
        chalkFaint: '#7A6F62',
        // Court and pitch markings, one per sport.
        sport: {
          football: '#5BA860',
          basketball: '#C8722F',
          tennis: '#CBD64B',
          cricket: '#D4C08A',
          badminton: '#4FA3A5',
          volleyball: '#4A79C4',
          fitness: '#9A8F80',
        },
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
