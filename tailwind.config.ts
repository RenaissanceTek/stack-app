import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          elev: '#141414',
          card: '#1a1a1a',
        },
        ink: {
          DEFAULT: '#f5f5f5',
          muted: '#a1a1a1',
          dim: '#6b6b6b',
        },
        accent: {
          DEFAULT: '#4ade80',
          dim: '#22c55e',
        },
        line: '#262626',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
