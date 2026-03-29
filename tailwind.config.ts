import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  safelist: [
    { pattern: /bg-\[(#58CC02|#1CB0F6|#FFC800|#FF4B4B|#CE82FF|#FF9600)\]/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        duo: {
          green: '#58CC02',
          'green-dark': '#4CAD00',
          'green-light': '#D7FFB8',
          blue: '#1CB0F6',
          'blue-dark': '#1899D6',
          'blue-light': '#E5F4FF',
          gold: '#FFC800',
          'gold-dark': '#E5A500',
          'gold-light': '#FFF4CC',
          red: '#FF4B4B',
          'red-light': '#FFE5E5',
          orange: '#FF9600',
          'orange-light': '#FFF0D5',
          purple: '#CE82FF',
          'purple-light': '#F3E5FF',
        },
        pastel: {
          blue: '#A7C7E7',
          purple: '#C7B8EA',
          pink: '#F8C8DC',
        },
      },
    },
  },
  plugins: [],
};

export default config;
