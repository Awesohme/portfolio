import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F0D",
        ink2: "#101714",
        emerald: {
          DEFAULT: "#10B981",
          glow: "#34D399",
          soft: "#6EE7B7",
        },
        muted: "#8FA39A",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        grotesk: ["var(--font-grotesk)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -6px rgba(16,185,129,.55)",
      },
    },
  },
  plugins: [],
} satisfies Config;
