/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans your files
    theme: {
      extend: {
        fontFamily: {
          maven: ['Maven Pro', 'sans-serif'],
        },


      },
    },
    plugins: [],
  };
  