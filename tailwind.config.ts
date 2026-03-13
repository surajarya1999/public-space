import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: "#0a0a0f",
        surface: "#13131a",
        surface2: "#1c1c28",
        border: "#2a2a3d",
        accent: "#7c6dff",
        accent2: "#ff6d8a",
        accent3: "#6dffcc",
        gold: "#ffd166",
        muted: "#8888aa",
      },
    },
  },
  plugins: [],
};

export default config;
