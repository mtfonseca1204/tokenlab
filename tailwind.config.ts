import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          secondary: 'rgb(var(--surface-2) / <alpha-value>)',
          tertiary: 'rgb(var(--surface-3) / <alpha-value>)',
          invert: 'rgb(var(--surface-invert) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--content) / <alpha-value>)',
          secondary: 'rgb(var(--content-2) / <alpha-value>)',
          muted: 'rgb(var(--content-3) / <alpha-value>)',
          faint: 'rgb(var(--content-4) / <alpha-value>)',
          invert: 'rgb(var(--content-invert) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          subtle: 'rgb(var(--line-subtle) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
