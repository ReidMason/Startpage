function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

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
          50: withOpacityValue("--colour-primary-50"),
          100: withOpacityValue("--colour-primary-100"),
          200: withOpacityValue("--colour-primary-200"),
          300: withOpacityValue("--colour-primary-300"),
          400: withOpacityValue("--colour-primary-400"),
          500: withOpacityValue("--colour-primary-500"),
          600: withOpacityValue("--colour-primary-600"),
          700: withOpacityValue("--colour-primary-700"),
          800: withOpacityValue("--colour-primary-800"),
          900: withOpacityValue("--colour-primary-900"),
        },
        green: {
          50: withOpacityValue("--colour-green-50"),
          100: withOpacityValue("--colour-green-100"),
          200: withOpacityValue("--colour-green-200"),
          300: withOpacityValue("--colour-green-300"),
          400: withOpacityValue("--colour-green-400"),
          500: withOpacityValue("--colour-green-500"),
          600: withOpacityValue("--colour-green-600"),
          700: withOpacityValue("--colour-green-700"),
          800: withOpacityValue("--colour-green-800"),
          900: withOpacityValue("--colour-green-900"),
        },
        yellow: {
          50: withOpacityValue("--colour-yellow-50"),
          100: withOpacityValue("--colour-yellow-100"),
          200: withOpacityValue("--colour-yellow-200"),
          300: withOpacityValue("--colour-yellow-300"),
          400: withOpacityValue("--colour-yellow-400"),
          500: withOpacityValue("--colour-yellow-500"),
          600: withOpacityValue("--colour-yellow-600"),
          700: withOpacityValue("--colour-yellow-700"),
          800: withOpacityValue("--colour-yellow-800"),
          900: withOpacityValue("--colour-yellow-900"),
        },
        grey: {
          50: withOpacityValue("--colour-grey-50"),
          100: withOpacityValue("--colour-grey-100"),
          200: withOpacityValue("--colour-grey-200"),
          300: withOpacityValue("--colour-grey-300"),
          400: withOpacityValue("--colour-grey-400"),
          500: withOpacityValue("--colour-grey-500"),
          600: withOpacityValue("--colour-grey-600"),
          700: withOpacityValue("--colour-grey-700"),
          800: withOpacityValue("--colour-grey-800"),
          900: withOpacityValue("--colour-grey-900"),
        },
        red: {
          50: withOpacityValue("--colour-red-50"),
          100: withOpacityValue("--colour-red-100"),
          200: withOpacityValue("--colour-red-200"),
          300: withOpacityValue("--colour-red-300"),
          400: withOpacityValue("--colour-red-400"),
          500: withOpacityValue("--colour-red-500"),
          600: withOpacityValue("--colour-red-600"),
          700: withOpacityValue("--colour-red-700"),
          800: withOpacityValue("--colour-red-800"),
          900: withOpacityValue("--colour-red-900"),
        },
      },
    },
  },
  plugins: [],
};
