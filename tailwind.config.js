/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'sans' akan menggantikan font default Tailwind
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#1F2937',
        'primary-accent': '#4F46E5',
        'secondary-button': '#6366F1',
        'dark-control': '#374151',
      },
    },
  },
  plugins: [],
}