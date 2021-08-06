const colors = require('tailwindcss/colors')
const config = {
  mode: 'jit',
  darkmode: false,//media or class we want to do class for the toggle
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
    },
  },
  plugins: [],
};

module.exports = config;
