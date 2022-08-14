const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui-lib/src/**/*.{js,ts,jsx,tsx,otf}',
  ],
  safelist: [
    'text-[#838383]',
    'text-[#00DC82]',
    'text-[#2e82ff]',
    'text-[#c13cff]',
    'text-[#f8b73e]',
    'text-[#ff44b7]',
    'bg-[#838383]',
    'bg-[#00DC82]',
    'bg-[#2e82ff]',
    'bg-[#c13cff]',
    'bg-[#f8b73e]',
    'bg-[#ff44b7]',
  ],
  theme: {
    extend: {
      letterSpacing: {
        veryWide: '0.165em',
      },
      height: {
        'screen-65': '65vh',
        'screen-30': '30vh',
      },
      fontFamily: {
        display: ['IM Fell DW Pica SC', 'serif'],
        body: ['IM Fell DW Pica', 'serif'],
        lords: ['Lords', 'serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[400]'),
            '--tw-prose-headings': theme('colors.gray[300]'),
            '--tw-prose-bold': theme('colors.gray[200]'),
          },
        },
      }),
      backgroundImage: {
        hero: "url('/dark.png')",
        conic: 'conic-gradient(var(--tw-gradient-stops))',
        'conic-to-t': 'conic-gradient(at top, var(--tw-gradient-stops))',
        'conic-to-b': 'conic-gradient(at bottom, var(--tw-gradient-stops))',
        'conic-to-l': 'conic-gradient(at left, var(--tw-gradient-stops))',
        'conic-to-r': 'conic-gradient(at right, var(--tw-gradient-stops))',
        'conic-to-tl': 'conic-gradient(at top left, var(--tw-gradient-stops))',
        'conic-to-tr': 'conic-gradient(at top right, var(--tw-gradient-stops))',
        'conic-to-bl':
          'conic-gradient(at bottom left, var(--tw-gradient-stops))',
        'conic-to-br':
          'conic-gradient(at bottom right, var(--tw-gradient-stops))',
        radial: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'radial-at-t':
          'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'radial-at-b':
          'radial-gradient(ellipse at bottom, var(--tw-gradient-stops))',
        'radial-at-l':
          'radial-gradient(ellipse at left, var(--tw-gradient-stops))',
        'radial-at-r':
          'radial-gradient(ellipse at right, var(--tw-gradient-stops))',
        'radial-at-tl':
          'radial-gradient(ellipse at top left, var(--tw-gradient-stops))',
        'radial-at-tr':
          'radial-gradient(ellipse at top right, var(--tw-gradient-stops))',
        'radial-at-bl':
          'radial-gradient(ellipse at bottom left, var(--tw-gradient-stops))',
        'radial-at-br':
          'radial-gradient(ellipse at bottom right, var(--tw-gradient-stops))',
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
          900: '#1b1b1d',
          1000: '#0e0e0e',
        },
        off: {
          100: '#F9F7F1',
          200: '#8D795B',
          300: '#f5eee6',
        },
        /* Crypts and Caverns color styles */
        desert: {
          /* Desert Oasis */ main: '#F3D899',
          door: '#00A29D',
          point: '#FAAA00',
        },
        temple: {
          /* Stone Temple */ main: '#967E67',
          door: '#006669',
          point: '#3C2A1A',
        },
        forest: {
          /* Forest Ruins */ main: '#2F590E',
          door: '#C55300',
          point: '#802F1A',
        },
        mountain: {
          /* Mountain Deep */ main: '#cf9479',
          door: '#FFA800',
          point: '#802F1A',
        },
        underwater: {
          /* Underwater Keeps */ main: '#006669',
          door: '#F9B569',
          point: '#967E67',
        },
        ember: {
          /* Ember's Glow */ main: '#5D0503',
          door: '#FF1800',
          point: '#B75700',
        },
      },
    },
  },
  plugins: [
    'tailwindcss',
    'autoprefixer',
    'postcss-100vh-fix',
    require('@tailwindcss/typography'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
};
