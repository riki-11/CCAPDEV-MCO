/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.{html,js}',
            './src/editprofile.html',
            './src/viewprofile.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Montserrat', 'sans-serif'],
  
      },
      colors:  {
        'secondary': '#F5CB5C',
        'primarybg':'#202020'
      }
    },
  },
  plugins: [],
}

