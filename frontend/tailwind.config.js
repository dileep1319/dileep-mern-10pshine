export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ✅ all JSX/TSX files included
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        'dancing-script': ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}
