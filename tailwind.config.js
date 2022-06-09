//** @type {import('tailwind.css').config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(var(--colour-primary-50) / <alpha-value>)",
          100: "rgb(var(--colour-primary-100) / <alpha-value>)",
          200: "rgb(var(--colour-primary-200) / <alpha-value>)",
          300: "rgb(var(--colour-primary-300) / <alpha-value>)",
          400: "rgb(var(--colour-primary-400) / <alpha-value>)",
          500: "rgb(var(--colour-primary-500) / <alpha-value>)",
          600: "rgb(var(--colour-primary-600) / <alpha-value>)",
          700: "rgb(var(--colour-primary-700) / <alpha-value>)",
          800: "rgb(var(--colour-primary-800) / <alpha-value>)",
          900: "rgb(var(--colour-primary-900) / <alpha-value>)",
        },
        green: {
          50: "rgb(var(--colour-green-50) / <alpha-value>)",
          100: "rgb(var(--colour-green-100) / <alpha-value>)",
          200: "rgb(var(--colour-green-200) / <alpha-value>)",
          300: "rgb(var(--colour-green-300) / <alpha-value>)",
          400: "rgb(var(--colour-green-400) / <alpha-value>)",
          500: "rgb(var(--colour-green-500) / <alpha-value>)",
          600: "rgb(var(--colour-green-600) / <alpha-value>)",
          700: "rgb(var(--colour-green-700) / <alpha-value>)",
          800: "rgb(var(--colour-green-800) / <alpha-value>)",
          900: "rgb(var(--colour-green-900) / <alpha-value>)",
        },
        yellow: {
          50: "rgb(var(--colour-yellow-50) / <alpha-value>)",
          100: "rgb(var(--colour-yellow-100) / <alpha-value>)",
          200: "rgb(var(--colour-yellow-200) / <alpha-value>)",
          300: "rgb(var(--colour-yellow-300) / <alpha-value>)",
          400: "rgb(var(--colour-yellow-400) / <alpha-value>)",
          500: "rgb(var(--colour-yellow-500) / <alpha-value>)",
          600: "rgb(var(--colour-yellow-600) / <alpha-value>)",
          700: "rgb(var(--colour-yellow-700) / <alpha-value>)",
          800: "rgb(var(--colour-yellow-800) / <alpha-value>)",
          900: "rgb(var(--colour-yellow-900) / <alpha-value>)",
        },
        grey: {
          50: "rgb(var(--colour-grey-50) / <alpha-value>)",
          100: "rgb(var(--colour-grey-100) / <alpha-value>)",
          200: "rgb(var(--colour-grey-200) / <alpha-value>)",
          300: "rgb(var(--colour-grey-300) / <alpha-value>)",
          400: "rgb(var(--colour-grey-400) / <alpha-value>)",
          500: "rgb(var(--colour-grey-500) / <alpha-value>)",
          600: "rgb(var(--colour-grey-600) / <alpha-value>)",
          700: "rgb(var(--colour-grey-700) / <alpha-value>)",
          800: "rgb(var(--colour-grey-800) / <alpha-value>)",
          900: "rgb(var(--colour-grey-900) / <alpha-value>)",
        },
        red: {
          50: "rgb(var(--colour-red-50) / <alpha-value>)",
          100: "rgb(var(--colour-red-100) / <alpha-value>)",
          200: "rgb(var(--colour-red-200) / <alpha-value>)",
          300: "rgb(var(--colour-red-300) / <alpha-value>)",
          400: "rgb(var(--colour-red-400) / <alpha-value>)",
          500: "rgb(var(--colour-red-500) / <alpha-value>)",
          600: "rgb(var(--colour-red-600) / <alpha-value>)",
          700: "rgb(var(--colour-red-700) / <alpha-value>)",
          800: "rgb(var(--colour-red-800) / <alpha-value>)",
          900: "rgb(var(--colour-red-900) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("firefox", "@-moz-document url-prefix()");
    }),
  ],
};
