import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offWhite: "#F2F2F2",
        offBlack: "#111313",
        midWhite: "#FAF4E8",
        skyBlue: "#BBEEFF",
        violet: "#FFDCFF",
        brill: "#11F313",
        sol: "#FBDB86",
        azul: "#6a82fa",
        mosgu: "#1C4D8D",
        fuego: "#111929",
        nuba: "#C9D8E4",
        frio: "#132742",
        mar: "#27BBCC",
        amo: "#44D7B6",
        zana: "#FBDB86",
        mos: "#05A5B7",
        pez: "#81A8F8",
        virg: "#EFEFEF",
        lima: "#CAED00",
        viol: "#D07BF7",
        fondo: "#1A08F1",
        naran: "#FF9147",
        amar: "#FFD86D",
        geren: "#A9E7FF",
        marron: "#D49E78",
        cafe: "#222222",
        fertil: "#11FCEB",
      },
      fontFamily: {
        bit: "Bitblox",
        vcr: "Vcr",
        rain: "Internal Rainbows",
        digi: "DS Digital",
        earl: "Earls Revenge",
        dog: "Dogica",
        gam: "Gamer",
        net: "Network",
      },
      fontSize: {
        xxs: "0.6rem",
      },
      width: {
        100: "26rem",
      },
      height: {
        100: "26rem",
      },
    },
  },
  plugins: [],
};
export default config;
