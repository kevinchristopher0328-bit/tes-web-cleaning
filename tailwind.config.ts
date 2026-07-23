import type { Config } from "tailwindcss";

/**
 * BERES — Design System
 * Semua nilai bersumber tunggal dari CSS variable di app/globals.css.
 * Config ini hanya "menjembatani" token itu ke utilitas Tailwind.
 *
 * Warna disimpan sebagai channel HSL, jadi kita bungkus dengan
 * hsl(var(--x) / <alpha-value>) agar modifier opacity tetap jalan.
 */

const withAlpha = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  // Styleguide membangun nama kelas skala warna secara dinamis
  // (mis. `bg-blue-${s}`), jadi JIT perlu di-safelist.
  safelist: [
    { pattern: /^bg-blue-(50|100|200|300|400|500|600|700|800|900|950)$/ },
    { pattern: /^bg-amber-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^bg-neutral-(0|50|100|200|300|400|500|600|700|800|900|950)$/ },
  ],
  theme: {
    extend: {
      colors: {
        // Skala palet mentah — untuk kebutuhan granular / styleguide.
        blue: {
          50: withAlpha("--blue-50"),
          100: withAlpha("--blue-100"),
          200: withAlpha("--blue-200"),
          300: withAlpha("--blue-300"),
          400: withAlpha("--blue-400"),
          500: withAlpha("--blue-500"),
          600: withAlpha("--blue-600"),
          700: withAlpha("--blue-700"),
          800: withAlpha("--blue-800"),
          900: withAlpha("--blue-900"),
          950: withAlpha("--blue-950"),
        },
        amber: {
          50: withAlpha("--amber-50"),
          100: withAlpha("--amber-100"),
          200: withAlpha("--amber-200"),
          300: withAlpha("--amber-300"),
          400: withAlpha("--amber-400"),
          500: withAlpha("--amber-500"),
          600: withAlpha("--amber-600"),
          700: withAlpha("--amber-700"),
          800: withAlpha("--amber-800"),
          900: withAlpha("--amber-900"),
        },
        neutral: {
          0: withAlpha("--neutral-0"),
          50: withAlpha("--neutral-50"),
          100: withAlpha("--neutral-100"),
          200: withAlpha("--neutral-200"),
          300: withAlpha("--neutral-300"),
          400: withAlpha("--neutral-400"),
          500: withAlpha("--neutral-500"),
          600: withAlpha("--neutral-600"),
          700: withAlpha("--neutral-700"),
          800: withAlpha("--neutral-800"),
          900: withAlpha("--neutral-900"),
          950: withAlpha("--neutral-950"),
        },

        // Token semantik — pakai ini di produk.
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),
        card: {
          DEFAULT: withAlpha("--card"),
          foreground: withAlpha("--card-foreground"),
        },
        popover: {
          DEFAULT: withAlpha("--popover"),
          foreground: withAlpha("--popover-foreground"),
        },
        muted: {
          DEFAULT: withAlpha("--muted"),
          foreground: withAlpha("--muted-foreground"),
        },
        primary: {
          DEFAULT: withAlpha("--primary"),
          hover: withAlpha("--primary-hover"),
          foreground: withAlpha("--primary-foreground"),
          subtle: withAlpha("--primary-subtle"),
          "subtle-foreground": withAlpha("--primary-subtle-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          hover: withAlpha("--accent-hover"),
          foreground: withAlpha("--accent-foreground"),
          subtle: withAlpha("--accent-subtle"),
          "subtle-foreground": withAlpha("--accent-subtle-foreground"),
        },
        secondary: {
          DEFAULT: withAlpha("--secondary"),
          foreground: withAlpha("--secondary-foreground"),
        },
        success: {
          DEFAULT: withAlpha("--success"),
          foreground: withAlpha("--success-foreground"),
          subtle: withAlpha("--success-subtle"),
        },
        warning: {
          DEFAULT: withAlpha("--warning"),
          foreground: withAlpha("--warning-foreground"),
          subtle: withAlpha("--warning-subtle"),
        },
        danger: {
          DEFAULT: withAlpha("--danger"),
          foreground: withAlpha("--danger-foreground"),
          subtle: withAlpha("--danger-subtle"),
        },
        info: {
          DEFAULT: withAlpha("--info"),
          foreground: withAlpha("--info-foreground"),
          subtle: withAlpha("--info-subtle"),
        },
        border: withAlpha("--border"),
        input: withAlpha("--input"),
        ring: withAlpha("--ring"),
      },

      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        sans: ["var(--font-body)"],
      },

      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["var(--text-sm)", { lineHeight: "1.25rem" }],
        base: ["var(--text-base)", { lineHeight: "1.6" }],
        lg: ["var(--text-lg)", { lineHeight: "1.75rem" }],
        xl: ["var(--text-xl)", { lineHeight: "1.9rem", letterSpacing: "-0.01em" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "2.1rem", letterSpacing: "-0.015em" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "2.4rem", letterSpacing: "-0.02em" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "2.9rem", letterSpacing: "-0.025em" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "6xl": ["var(--text-6xl)", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
      },

      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        DEFAULT: "var(--radius)",
      },

      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        focus: "var(--shadow-focus)",
        glow: "var(--shadow-glow)",
        none: "none",
      },

      spacing: {
        0: "var(--space-0)",
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
        20: "var(--space-20)",
        24: "var(--space-24)",
      },

      maxWidth: {
        content: "72rem",
      },

      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
