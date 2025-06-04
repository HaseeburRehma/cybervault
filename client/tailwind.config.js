/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        tomato: ["TomatoGrotesk", "sans-serif"],
      },
      colors: {
        vaultguard: {
          primary:  "#10B981",
          secondary:"#059669",
          accent:   "#34D399",
          dark:     "#064E3B",
          light:    "#D1FAE5",
        },
        emerald: {
          50:"#ECFDF5",100:"#D1FAE5",200:"#A7F3D0",300:"#6EE7B7",
          400:"#34D399",500:"#10B981",600:"#059669",700:"#047857",
          800:"#065F46",900:"#064E3B",
        },
      },
      animation: {
        scroll: "scroll 20s linear infinite",
        pulse : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        scroll: {
          "0%"  : { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
