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
        brand: {
          primary: "#1B5E20",
          accent: "#2D8C4E",
          light: "#E8F5E9",
          deep: "#0D2F17",
          gold: "#F9A825",
          alert: "#E65100",
        },
        ink: {
          DEFAULT: "#212121",
          muted: "#424242",
        },
        surface: {
          subtle: "#FAFAFA",
          /** Warm paper — use instead of pure white for long pages */
          cream: "#EEF2EC",
          mist: "#E2E9E0",
          sage: "#D8E2D6",
          line: "#D0D9CC",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
        heading: ["var(--font-nunito)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.07)",
        cardHover: "0 12px 40px rgba(27,94,32,0.14)",
        diffusion: "0 20px 40px -15px rgba(0,0,0,0.05)",
        innerHighlight: "inset 0 1px 0 rgba(255,255,255,0.12)",
      },
      borderRadius: {
        card: "14px",
        btn: "6px",
        shell: "2rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulseRing: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.08)" },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        marqueeReverse: "marqueeReverse 42s linear infinite",
        pulseRing: "pulseRing 2.4s ease-in-out infinite",
        floatSoft: "floatSoft 5s ease-in-out infinite",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
