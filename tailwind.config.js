/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Keep in sync with the :root tokens in src/styles/global.css.
      colors: {
        paper: '#faf6ed',
        surface: '#ffffff',
        ink: '#1c2433',
        faded: '#857e6e',
        indigo: '#3f4c9c',
        redpen: '#c33d35',
        gold: '#c9971c',
        teal: '#2e7d6e',
        line: '#e6ddc9',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
