/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Keep in sync with the :root tokens in src/styles/global.css.
      colors: {
        paper: '#f2f1ec',
        surface: '#ffffff',
        ink: '#191b1f',
        faded: '#71685c',
        indigo: '#35506e',
        redpen: '#ab3a30',
        gold: '#a8791f',
        teal: '#24675c',
        line: '#dcdad2',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
      borderRadius: {
        card: 'var(--radius)',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
      screens: {
        wide: '861px', // prototype breakpoint: single column at <=860px
      },
    },
  },
  plugins: [],
}
