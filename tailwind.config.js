/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT FOR TAILWIND TO APPLY TO ALL OUR HTML FILES (ADD HANDLEBARS FILES HERE EVENTUALLY)
  content: ["./public/**/*.{html,js}", 
            "./src/**/*.{html,js}",
            "./views/**/*.{html,js,hbs}"],
  theme: {
    extend: {
      fontFamily: {
          'primary': ['Montserrat', 'sans-serif'],
          'secondary': ['Crimson-Pro', 'serif']
      },
      colors:  {
          'primary':'#202020',
          'secondary': '#F5CB5C',
          'gold': '#F5CB5C',
          'silver': '#797979',
          'success':'#238636',
          'danger': '#da3633',
          'success-hover': '#2ea043',
          'grayed': 'rgb(89, 89, 89)',
      },
      height: {
        '80-screen': '80vh',
      },
      minHeight: {
        '300': '300px'
      },
      width: {
        '18': '4.5rem',
      },
      backgroundImage: {
        'bg-henry-sy': "url('../images/henry_sy-bg.jpg')" // can't figure this out yet. please find a way 
      }
    },
  },
  plugins: [],
}

