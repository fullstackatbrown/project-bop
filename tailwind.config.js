/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        avenir: [
          "avenir-lt-w01_85-heavy1475544",
          "avenir-lt-w05_85-heavy",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
