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
        nave: "#0b0e16",
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
        mos: "#05A5B7",
        pez: "#81A8F8",
        virg: "#EFEFEF",
        lima: "#CAED00",
        viol: "#D07BF7",
        fondo: "#1A08F1",
        oscuro: "#0D35CA",
        naran: "#FF9147",
        amar: "#FFD86D",
        geren: "#A9E7FF",
        marron: "#D49E78",
        cafe: "#222222",
        fertil: "#11FCEB",
        ballena: "#FFD85F",
        emeral: "#6DD400",
        piloto: "#191919",
        fuera: "#85AEFF",
        trip: "#078fd6",
        saph: "#0091FF",
        olor: "#F9ED00",
        lirio: "#D401F8",
        hierba: "#03DB6A",
        afilado: "#4E4D4D",
        cereza: "#F28548",
        humor: "#F7B500",
        suave: "#C27AA0",
        cost: "#847FF2",
        girasol: "#FBD201",
      },
      fontFamily: {
        bit: "Bitblox",
        vcr: "Vcr",
        rain: "Internal Rainbows",
        ignite: "Ignite",
        digi: "DS Digital",
        earl: "Earls Revenge",
        dog: "Dogica",
        gam: "Gamer",
        net: "Network",
        beb: "Bebas",
        aust: "Austral",
      },
      fontSize: {
        xxs: "0.6rem",
        tee: "0.4rem",
      },
      width: {
        100: "26rem",
        110: "30rem",
      },
      height: {
        100: "26rem",
        110: "32rem",
      },
      zIndex: {
        1: "1",
        60: "60",
      },
      backgroundImage: {
        legend: `url("https://chromadin.infura-ipfs.io/ipfs/QmWDqwGn7JgWzFsvUuC6pR7P58v6ab1npPueJ9Vfaez8iW")`,
        grant: `url("https://chromadin.infura-ipfs.io/ipfs/QmSGW3JvdMuWFtNqk7QHYTfWbDcixT4MW3KGsqPdUJYxoJ")`,
        listener: `url("https://chromadin.infura-ipfs.io/ipfs/Qmb8nqNPpXRrJTLgKJtRF6n9AW7cvKojtRSBLsbGoD1Ug2")`,
        web: `url("https://chromadin.infura-ipfs.io/ipfs/QmYRZYGFKgH6wGJ39aWHbr7T1PsySh2kTSjo11yEZrrGcM")`,
        blurs: `url("https://chromadin.infura-ipfs.io/ipfs/QmZh9CGujyhWtdfF2C1W1TxSUHP8zmaGbcuzLsi1LeEkXY")`,
        synth: `url("https://chromadin.infura-ipfs.io/ipfs/QmVaK6MVXPzdGb7XSBXqP4bXGzrsbtd1yECafztTT4dvjp")`,
      },
      screens: {
        tablet: "900px",
        galaxy: "300px",
        pre: "400px",
        otro: "1350px",
      },
    },
  },
  plugins: [],
};
export default config;
