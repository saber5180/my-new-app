/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-blue-500',
    'hover:bg-blue-600',
    'border-white',
    'w-8',
    'h-8'
  ],
    content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure Tailwind scans your files
    theme: {
      extend: {
        boxShadow: {
           'subtle': '0 1px 3px rgba(0,0,0,0.08)',
          'map-panel': '0 2px 6px rgba(0,0,0,0.1)'
        },
        fontFamily: {
          maven: ['Maven Pro', 'sans-serif'],
        },


      },
    },
    plugins: [ require('tailwind-scrollbar')],
  };
  