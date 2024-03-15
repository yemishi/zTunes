import type { Config } from "tailwindcss";

const neutralDark = {
  400: "#3b3630",
  500: "#2e2a25",
  600: "#25221e",
  650: "#231f1b",
  700: "#1f1c19",
  800: "#181512",
  900: "#0e0d0b",
};

const black = {
  300: "#2f2f2f",
  400: "#212121",
  450: "#1c1c1c",
  500: "#161616",
  550: "#141414",
  600: "#121212",
  700: "#101010",
  800: "#0a0a0a",
  900: "#000000",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        playFair: ["var(--font-playFair)"],
        kanit: ["var(--font-kanit)"],
        montserrat: ["var(--font-montserrat)"],
      },
      colors: {
        neutralDark: { ...neutralDark },
        black: { ...black, DEFAULT: "#000000" },
      },
    },
  },
  plugins: [],
};
export default config;
