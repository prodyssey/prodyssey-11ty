const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js,njk}"],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        secondary: "#34495E",
        accent: "#E74C3C",
        background: "#ECF0F1",
        text: "#7F8C8D",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
      },
      // backgroundImage: {
      //   'circuit-pattern': "url('/assets/images/circuit-pattern.svg')",
      //   'greek-pattern': "url('/assets/images/greek-pattern.svg')",
      // },
    },
  },
  plugins: [],
};
