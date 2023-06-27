/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,ts,jsx}", "./public/index.html"],
  theme: {
    extend: { 
      boxShadow:{
        'widget': 'rgba(0, 0, 0, 0.16) 2px 5px 5px',
      },
      keyframes: {
        'blink': { '0%': { opacity: 1 }, '50%': { opacity: 0 }, },
        'line': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' }}, 
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'line-loading': 'line 2.5s infinite',
        'flow-loading': 'line 2.5s infinite',
      }
    },
  },
  darkMode: false,
  variants: {
    extend: {},
  },
  plugins: [],
}