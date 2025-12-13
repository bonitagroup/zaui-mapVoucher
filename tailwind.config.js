module.exports = {
  darkMode: ['selector', '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#D83231',
        secondary: '#F6B025',
        success: '#00A300',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
};
