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
        background: "var(--background)",
        foreground: "var(--foreground)",
        glass: {
          50: "rgba(255, 255, 255, 0.05)",
          100: "rgba(255, 255, 255, 0.1)",
          200: "rgba(255, 255, 255, 0.2)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-green": "glowGreen 2s ease-in-out infinite alternate",
        "glow-amber": "glowAmber 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glowGreen: {
          "0%": { boxShadow: "0 0 5px rgba(74, 222, 128, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(74, 222, 128, 0.6), 0 0 40px rgba(74, 222, 128, 0.3)" },
        },
        glowAmber: {
          "0%": { boxShadow: "0 0 5px rgba(251, 191, 36, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;