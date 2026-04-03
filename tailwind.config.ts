import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
      },
      colors: {
        card: '#F7F7F9',
        canvas: '#EDEDED',
      },
      spacing: {
        '18': '72px',
      },
    },
  },
  plugins: [],
}

export default config
