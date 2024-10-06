/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // fontFamily: {
      fontFamily: {
        'sans': ['"Untitled Sans"', ...defaultTheme.fontFamily.sans],
        'head': ['Helvetica Neue','sans-serif']
      },
    // },
    extend: {
      colors:{
        beige:'#F9F5F6',
        light:'#F8E8EE',
        medium:'#FDCEDF',
        dark:'#F2BED1',
        darker:'#F875AA'
      },
      animation: {
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite"
      }
      
    },
  },
  plugins: [
    // ...
  
],
}

