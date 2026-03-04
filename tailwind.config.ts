
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        general: ['"General Sans"', 'sans-serif'],
        readex: ['"Readex Pro"', 'sans-serif'],
           bodoni: ['"Bodoni Moda"', 'serif'],
      },
        colors: {
        lightgray: '#D3D3D3', 
      },
      backgroundImage:{
        out:"url(/assets/outpng.jpg)",
        contactus:"url(/assets/contactus.jpg)",
        
      }
    },
  },
  plugins: [],
};

export default config;
