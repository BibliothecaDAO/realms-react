module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        display: ['EB Garamond', 'serif'],
        body: ['Inconsolata', 'monospace'],
      },
      backgroundImage: {
        'hero': "url('https://cdna.artstation.com/p/assets/images/images/012/000/438/large/jose-ochoa-dawncathedral-joseochoa.jpg?1541606525')",
      },
      colors: {
        gray: {
          100: '#edece9',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#161619',
          1000: '#0e0e0e',
        },
        off: {
          100: '#F9F7F1',
          200: '#8D795B',
        },
        minHeight: {
          0: '0',
          '1/4': '25vh',
          '1/2': '50vh',
          '3/4': '75vh',
          80: '80px',
          full: '100vh',
        }
      },
    },
  },
  plugins: [],
}
