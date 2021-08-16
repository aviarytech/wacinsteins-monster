const colors = require("tailwindcss/colors");
const config = {
  mode: "jit",
  darkmode: false, //media or class we want to do class for the toggle
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
      maxWidth: {
        "1/8": "12%",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

module.exports = config;
