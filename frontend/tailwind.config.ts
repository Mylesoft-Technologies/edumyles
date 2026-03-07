import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', "sans-serif"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--forest-green)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--surface)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--surface)",
          foreground: "var(--foreground)",
        },
        primary: {
          DEFAULT: "var(--forest-green)",
          foreground: "var(--white)",
        },
        secondary: {
          DEFAULT: "var(--surface)",
          foreground: "var(--foreground)",
        },
        destructive: {
          DEFAULT: "var(--crimson-red)",
          foreground: "var(--white)",
        },
        card: {
          DEFAULT: "var(--white)",
          foreground: "var(--foreground)",
        },
        popover: {
          DEFAULT: "var(--white)",
          foreground: "var(--foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-bg)",
          foreground: "var(--sidebar-text-active)",
          primary: "var(--sidebar-text-active)",
          "primary-foreground": "var(--sidebar-bg)",
          accent: "var(--sidebar-active)",
          "accent-foreground": "var(--sidebar-text-active)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-active)",
        },
        forest: {
          50: "#e8f5ee",
          100: "#c6e6d4",
          200: "#9dd4b6",
          300: "#6dbf94",
          400: "#3ea96f",
          500: "#056C40",
          600: "#045e38",
          700: "#034d2e",
          800: "#023c24",
          900: "#012b1a",
        },
        crimson: {
          50: "#fdeaea",
          100: "#f9c4c5",
          200: "#f49a9b",
          300: "#ef6f70",
          400: "#ea4a4c",
          500: "#E42527",
          600: "#cc2123",
          700: "#a91b1d",
          800: "#871617",
          900: "#640f10",
        },
        amber: {
          50: "#fff9e5",
          100: "#fff0b8",
          200: "#ffe68a",
          300: "#ffdc5c",
          400: "#ffd23e",
          500: "#FFD731",
          600: "#e6c12c",
          700: "#bf9f24",
          800: "#997f1d",
          900: "#735f15",
        },
        charcoal: {
          DEFAULT: "#101010",
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#b3b3b3",
          300: "#808080",
          400: "#4d4d4d",
          500: "#101010",
        },
        cream: {
          DEFAULT: "#F8F8F8",
          50: "#ffffff",
          100: "#FAFAFA",
          200: "#F8F8F8",
          300: "#F0F0F0",
          400: "#E8E8E8",
        },
        zoho: {
          blue: "#056CB8",
        },
      },
      fontSize: {
        hero: ["60px", { lineHeight: "1.1", fontWeight: "700" }],
        section: ["40px", { lineHeight: "1.15", fontWeight: "700" }],
        "body-lg": ["17px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      maxWidth: {
        page: "1300px",
      },
    },
  },
  plugins: [animate],
};

export default config;
