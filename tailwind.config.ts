import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SakAi Design System
        "navy": "#1A1533",
        "indigo-deep": "#3D2B6B",
        "violet-primary": "#4C2A72",
        "violet-dark": "#401551",
        "accent-yellow": "#F4B400",
        "purple-secondary": "#B797C4",
        "purple-light": "#E9D0F3",
        "surface": "#FFFFFF",
        "surface-off": "#F7F5FA",
        "text-primary": "#1F1B24",
        "text-secondary": "#6B6570",
        "success": "#2E9E5B",
        "danger": "#D64545",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        sheet: "24px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
        "card-lg": "0 8px 24px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1A1533 0%, #3D2B6B 100%)",
        "hero-gradient-v": "linear-gradient(180deg, #1A1533 0%, #3D2B6B 100%)",
      },
      keyframes: {
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "#4C2A72" },
          "50%": { borderColor: "#F4B400" },
        },
        "draw-check": {
          from: { strokeDashoffset: "100" },
          to: { strokeDashoffset: "0" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "slide-up": "slide-up 250ms ease-out",
        "slide-in": "slide-in 250ms ease-out",
        "fade-in": "fade-in 200ms ease-out",
        "scale-in": "scale-in 200ms ease-out",
        "bounce-in": "bounce-in 500ms ease-out",
        "pulse-border": "pulse-border 1s ease-in-out",
        "draw-check": "draw-check 600ms ease-out forwards",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
