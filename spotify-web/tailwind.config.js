/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',  // Fundo bem clarinho (Creme)
          100: '#f2e8e5', // Fundo de cards
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a1887f', // Marrom pastel (Principal)
          600: '#8d746a',
          700: '#796359',
          800: '#4e4039', // Texto escuro
          900: '#3b302b', // Quase preto
        }
      }
    },
  },
  plugins: [],
}