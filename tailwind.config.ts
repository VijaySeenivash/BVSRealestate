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
        navy: {
          50: "#f0f5fa",
          100: "#e2ecf5",
          200: "#c7d9ec",
          300: "#9ebfe0",
          400: "#6e9ecc",
          500: "#4980b7",
          600: "#36669c",
          700: "#2d527f",
          800: "#183459",
          850: "#102644",
          900: "#0b1d33",
          950: "#06101d",
        },
        gold: {
          50: "#fbf8ea",
          100: "#f6ecc8",
          200: "#eed894",
          300: "#e4bf5c",
          400: "#dda932",
          500: "#cc911f",
          600: "#b07217",
          700: "#8c5316",
          800: "#744218",
          900: "#623719",
        },
        bvsRed: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
