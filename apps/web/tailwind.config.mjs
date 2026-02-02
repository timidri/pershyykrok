/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './src/**/*.css'],
  safelist: [
    'font-heading',
    'font-body',
    'font-light',
    'text-h1',
    'text-h2',
    'text-h3',
    'text-h4',
    'text-h5',
    'text-h6',
    'text-body',
    'text-center',
    'text-justify',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Inknut Antiqua"', 'Georgia', 'serif'],
        body: ['"Acumin Pro"', 'Georgia', 'serif'],
      },
      fontSize: {
        h1: ['59px', { lineHeight: '78px' }],
        h2: ['48px', { lineHeight: '1.2' }],
        h3: ['31px', { lineHeight: '45px' }],
        h4: ['24px', { lineHeight: '1.3' }],
        h5: ['20px', { lineHeight: '1.35' }],
        h6: ['17px', { lineHeight: '1.4' }],
        body: ['17px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};
