let zIndex = {};

// Fine-Grained 'zIndex'
for (let idx = 0; idx <= 50; idx += 5) {
  zIndex = {
    ...zIndex,
    [idx]: idx + ''
  };
}

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif']
    },
    extend: {
      zIndex
    }
  },
  plugins: []
};
