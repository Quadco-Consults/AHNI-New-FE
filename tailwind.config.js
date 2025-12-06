/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx, ts,tsx}",
    "./components/**/*.{js,jsx, ts,tsx}",
    "./app/**/*.{js,jsx, ts,tsx}",
    "./src/**/*.{js,jsx, ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        alternate: {
          DEFAULT: "hsl(var(--alternate))",
          light: "hsl(var(--alternate-light))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        yellow: {
          darker: "hsl(var(--yellow-darker))",
        },
        gray: {
          text: "hsl(var(--gray-text))",
          dark: "hsl(var(--gray-dark))",
          overlay: "hsl(var(--gray-overlay))",
          border: "hsl(var(--gray-border))",
        },
        // Status colors using CSS variables
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
        pending: "hsl(var(--pending))",
        // Priority colors using CSS variables
        urgent: "hsl(var(--urgent))",
        high: "hsl(var(--high))",
        medium: "hsl(var(--medium))",
        low: "hsl(var(--low))",
        system: "hsl(var(--system))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        'heading-1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.025em' }], // 32px, bold
        'heading-2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.025em' }],   // 24px, semibold
        'heading-3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.025em' }], // 20px, semibold
        'heading-4': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600', letterSpacing: '-0.025em' }], // 18px, semibold
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],      // 16px, normal
        'body-base': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px, normal
        'body-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],       // 12px, normal
      },
      spacing: {
        'xs': 'var(--spacing-xs)',     // 4px
        'sm': 'var(--spacing-sm)',     // 8px
        'md': 'var(--spacing-md)',     // 16px
        'lg': 'var(--spacing-lg)',     // 24px
        'xl': 'var(--spacing-xl)',     // 32px
        'xxl': 'var(--spacing-xxl)',   // 48px
        'xxxl': 'var(--spacing-xxxl)', // 64px
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      zIndex: {
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
