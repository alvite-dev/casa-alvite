import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F4E8DA',
        verde: '#6A6D51',
        roxo: '#532C51',
        amarelo: '#D59146',
        terracotta: '#B55C3A',
        cinza: '#40413E',
      },
      fontFamily: {
        'instrument': ['Instrument Sans', 'sans-serif'],
        'junyper': ['var(--font-juniper-bay)', 'Crimson Text', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config 