module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': {
            opacity: 0,
            transform: 'translateX(100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0%)',
          },
        },
      },
      animation: {
        'slideIn-fast': 'slideIn 0.15s ease-in-out',
        'fadeIn-medium': 'fadeIn 0.2s ease-in-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
