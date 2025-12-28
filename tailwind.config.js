/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'satoshi': ['Satoshi-Regular'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-bold': ['Satoshi-Bold'],
        'satoshi-black': ['Satoshi-Black'],
      },
      colors: {
        foundation: {
          blue: {
            light: '#EDF0FE',
            normal: '#4B68F7',
            dark: '#384EB9', 
            darker: '#1A2456',
          },
          yellow: {
            light: '#FFF9E7',
            normal: '#FCC212',
            dark: '#BD920E',
            darker: '#584406',
          },
          yellow2: {
            light: '#FEFBEB',
            normal: '#F3D733',
            dark: '#B6A126',
            darker: '#554B12',
          },
          red: {
            light: '#FDEEEE',
            normal: '#EC5252',
            dark: '#B13E3E',
            darker: '#531D1D',
          },
        },
      },
    },
  },
  plugins: [],
}