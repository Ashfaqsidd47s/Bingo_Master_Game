/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'rotate(12deg) translateY(0)' },  // Initial rotation and no movement
          '50%': { transform: 'rotate(12deg) translateY(-15px)' },  // Upward movement
          '100%': { transform: 'rotate(12deg) translateY(0)' },  // Back to the original Y position
        },
        floatTwo: {
          '0%': { transform: 'translateY(110vh) translateX(0px)', opacity : 0.75 },  // Initial rotation and no movement
          '100%': { transform: 'rotate(180deg) translateY(0vh) translateX(-30px)', opacity: 0 },  // Back to the original Y position
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        floattwo: 'floatTwo 8s ease-in-out infinite',
        floattwo10: 'floatTwo 10s ease-in-out infinite',
        floattwo5: 'floatTwo 5s ease-in-out infinite',
        floattwo12: 'floatTwo 12s ease-in-out infinite',
        floattwo6: 'floatTwo 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

