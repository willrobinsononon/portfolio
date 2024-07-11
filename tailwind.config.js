/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}", "./dist/about/*.{html,js}", "./dist/js/*{html,js}", "./dist/js/components/*{html,js}"],
  theme: {
    extend: {
      width: {
        'main-md': '40rem',
        'main-lg': '56rem'
      },
      colors: {
        'neon-turq': 	'	#52ffe1',
        'neon-green': '#63f97c',
        'neon-pink': '#f668ff',
        'neon-red': '#ff6a6a',
        'neon-purple': '#9c2bb3',
        'neon-dark-purple': '#4e26a8',
        'neon-dark-purple1': '#9578d6',
        'neon-dark-purple2': '#7042d7',
        'light-purple': '#E2D6FF',
        'light-green': '#D6FFDB',
        'neon-blue': '#2922c8',
        'neon-blue2': '#866aff',
        'main-background': '#FFEBD7',
      }
    },
    fontFamily: {
      'sans': 'Plus Jakarta Sans, Helvetica Neue LT, Helvetica Neue, Helvetica, sans-serif' ,
      'serif': 'Crimson Text, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      'mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    }, 
  },
  plugins: [],
}
