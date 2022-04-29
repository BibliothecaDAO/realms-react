module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      smphone: { min: '300px' },
      phone: { min: '500px' },
      tablet: { min: '640px' },
      minilap: { min: '815px' },
      laptop: { min: '1024px' },
      desktop: { min: '1280px' },
      standard: { min: '1536px' },
    },
    fontFamily: {
      Inconsolata: ['Inconsolata', 'monospace'],
      EB_Garamond: ['"EB Garamond"', 'serif'],
    },
  },
  plugins: [],
};
