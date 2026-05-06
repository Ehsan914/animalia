/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'mc-primary':     '#3E8E41',         // Button border (dark green)
        'mc-grass':       '#5DBE62',           // Grass green (light green)
        'mc-sky':         '#87CEEB',             // Sky blue
        'mc-wood':        '#8B5A2B',            // Wood tan (brown)
        
        // Secondary greens
        'mc-creeper':     '#E8F5E9',         // Creeper green (very light)
        'mc-green-light': '#C8E6C9',     // Light green
        
        // Accent colors
        'mc-heart':       '#CC3E41',           // Heart red (love/like)
        'mc-emergency':   '#D32F2F',       // Emergency red (bright red)
        'mc-muted-red':   '#E06E6E',

        //Neutral colors
        'mc-white':       '#FFFFFF',
        'mc-black':       '#000000'
      },
      fontFamily: {
        'sans': ['Nunito', 'sans-serif'],           // Default body font
        'pixel': ['Press Start 2P', 'cursive'],     // Retro pixel font (titles/headings)
        'pixel-alt': ['VT323', 'monospace'],        // Alternative pixel font
      },
      boxShadow: {
        'mc-sharp':        '4px 4px 0px 0px #3e8e41',
        'mc-sharp-lg':     '8px 8px 0px 0px #3e8e41',
        'mc-flat':         '0px 0px 0px 0px #3e8e41',
      }
    },
  },
  plugins: [],
}
