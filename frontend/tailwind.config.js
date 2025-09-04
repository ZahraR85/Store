/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { colors: {
      customBg: "#FAF9F5", 
      customBg1: "#FFF2F4",
      customBg2: "#f6e0e3",
      BgPinkLight: "#f5d0cb",
      BgPink: "#FCE5DC",
      BgBlack: "#0D0C0C",
      BgBlackLight : "#302A2A",
      BgGray: "#d9dad0",
      BgCreme: "#e8dfcf",
      BgKhaki : "#d5c0b5",
      BgKhakiDark : "#888884",
      BgFont: "Black",
      BgFontLight: "White",
      LightGold: "#DBD084",
      DarkGold: "#DBC537",
      bgfooter: "#b39b81",
      bgbackground:"#e6e4df"
    },
    fontSize: {
      'xxs': '0.625rem', // or any value smaller than xs
      'custom': '0.8rem',
    },
    backgroundImage: {
      'custom-gradient': 'linear-gradient(90deg, rgba(118,154,110) 0%, rgba(31,66,32) 100%)',
    },},
  },
  plugins: [],
}
