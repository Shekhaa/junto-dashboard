import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#0B0F19",
          subtle: "#0F1626",
        },
        surface: {
          DEFAULT: "#111827",
          hover: "#172033",
          active: "#1E293B",
          card: "#111827",
        },
        border: {
          subtle: "#1F2937",
          focus: "#374151",
          bright: "#4B5563",
        },
        junto: {
          indigo: "#6366F1",
          "indigo-hover": "#4F46E5",
          "indigo-light": "#818CF8",
          green: "#10B981",
          "green-hover": "#059669",
          "green-light": "#34D399",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "beacon": "beacon 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        beacon: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
