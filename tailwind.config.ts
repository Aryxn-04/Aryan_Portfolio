import type { Config } from "tailwindcss";

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bg: "rgb(var(--bg-rgb) / <alpha-value>)",
      "surface-1": "rgb(var(--surface-1-rgb) / <alpha-value>)",
      "surface-2": "rgb(var(--surface-2-rgb) / <alpha-value>)",
      text: "rgb(var(--text-rgb) / <alpha-value>)",
      muted: "rgb(var(--muted-rgb) / <alpha-value>)",
      accent: "rgb(var(--accent-rgb) / <alpha-value>)",
      "accent-action": "var(--accent-action)",
      hairline: "var(--hairline)",
    },
    spacing: {
      0: "0px",
      px: "1px",
      1: "var(--space-half)",
      2: "var(--space-1)",
      4: "var(--space-2)",
      6: "var(--space-3)",
      8: "var(--space-4)",
      10: "var(--space-5)",
      12: "var(--space-6)",
      16: "var(--space-8)",
      24: "var(--space-12)",
      32: "var(--space-16)",
    },
    borderRadius: { none: "0", md: "var(--radius-md)", lg: "var(--radius-lg)", full: "9999px" },
    fontFamily: {
      sans: ["var(--font-inter)", "sans-serif"],
      mono: ["var(--font-jetbrains-mono)", "monospace"],
      handwriting: ["var(--font-caveat)", "cursive"],
    },
    extend: {
      transitionDuration: { ui: "var(--motion-ui)" },
      maxWidth: { content: "var(--content-max)" },
      letterSpacing: { heading: "var(--tracking-heading)" },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
