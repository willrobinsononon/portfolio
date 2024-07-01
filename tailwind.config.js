/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}", "./dist/html/*.{html,js}", "./dist/js/components/*{html,js}"],
  theme: {
    extend: {
      colors: {
        'neon-turq': 	'	#52ffe1',
        'neon-green': '#63f97c',
        'neon-pink': '#f668ff',
        'neon-red': '#ff6a6a',
        'neon-purple': '#9c2bb3',
        'neon-dark-purple': '#5521cb',
        'neon-blue': '#2922c8',
        'neon-blue2': '#866aff'
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
