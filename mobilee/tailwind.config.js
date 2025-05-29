/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ff7f50",  // used for borders, buttons, highlights, hover links
          200: "#ff6b6b",  // used for main headings, text, bg-gradient-fro
        },
        secondary: {
          100: "#2e4057",
          200: "#1a2a3a",
        },
        },
        accent: {
          100: "#82a0b6",  // used for subheading text
        },
      gradient : {
        100: "linear-gradient(to right, #ff7f50, #ff6b6b)",

      },
      },
    },
  plugins: [],
}