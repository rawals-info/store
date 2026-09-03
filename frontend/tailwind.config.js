const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      colors: {
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
        // New B2C commercial design tokens
        petha: {
          cream:      "#FAF8F4",   // Page base bg
          warm:       "#F2EDE4",   // Alternating section bg
          amber:      "#B45309",   // Primary CTA, links (WCAG AA Compliant 4.53:1 contrast)
          saffron:    "#92400E",   // Hover, badges (WCAG AAA Compliant 6.91:1 contrast)
          terracotta: "#C2410C",   // Sale badges, urgency
          forest:     "#1E3A2F",   // Deep accent headings, announcement bar
          slate:      "#1F2937",   // Body copy, nav
          mist:       "#F9FAFB",   // Card backgrounds
          gold:       "#B45309",   // Harmonised gold accent
          border:     "#E8DDD0",   // Warm border color
          text:       "#2D2013",   // Primary text - warm dark
          subtle:     "#7C6B5A",   // Muted text
        },
        luxury: {
          gold: "#F4C110",           // Vibrant golden accent used in the new design
          lightgold: "#FBE57F",     // Softer golden tint for subtle decorations
          charcoal: "#333333",       // Keep for overlays
          cream: "#F8F5F0",          // Light cream for contrast sections
          ivory: "#0A0A0A",          // Black base background color
          saffron: "#FFB347",        // Warm saffron accent for tertiary highlights
        },
        'luxury-gold': {
          DEFAULT: '#F4C110',
          '50': '#F8F3E3',
          '100': '#F1E6C7',
          '200': '#E9D59B',
          '300': '#E2C46F',
          '400': '#DBB843',
          '500': '#F4C110',
          '600': '#B0902A',
          '700': '#8B7121',
          '800': '#665219',
          '900': '#413511',
        },
        'luxury-charcoal': {
          DEFAULT: '#36454F',
          light: '#4F6373',
          dark: '#2A353D',
        },
        'luxury-ivory': {
          DEFAULT: '#FFFAF2', // Soft ivory / off-white
          dark: '#F7F3EB',
        },
        'luxury-saffron': {
          DEFAULT: '#FFB347',
          '50': '#FFF8ED',
          '100': '#FFEBD2',
          '200': '#FFD29A',
          '300': '#FFB347',
          '400': '#E09A2D',
          '500': '#C48415',
          '600': '#A46F0E',
          '700': '#7F5509',
          '800': '#5C3C06',
          '900': '#3B2603',
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
      },
      fontFamily: {
        sans: [
          "var(--font-jakarta)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        serif: [
          "var(--font-cormorant)",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        display: [
          "var(--font-cormorant)",
          "Georgia",
          "serif",
        ],
        jakarta: [
          "var(--font-jakarta)",
          "sans-serif",
        ],
        cormorant: [
          "var(--font-cormorant)",
          "Georgia",
          "serif",
        ],
        mono: [
          "Menlo",
          "Monaco",
          "Courier New",
          "monospace",
        ],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "elegant-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in": "fade-in 0.7s ease-in-out forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
        "elegant-pulse": "elegant-pulse 3s ease-in-out infinite",
        "gentle-float": "gentle-float 6s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite linear",
      },
      boxShadow: {
        'luxury-sm': '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(212, 175, 55, 0.1)',
        'luxury-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(212, 175, 55, 0.2)',
        'luxury-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(212, 175, 55, 0.2)',
        'luxury-xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
