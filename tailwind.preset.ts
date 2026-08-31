/**
 * Agile Coder — Design System Tailwind preset.
 *
 * Single source of truth for the design tokens consumed by the component
 * library in `src/components/base` and `src/components/application`.
 *
 * Plugging it in (Tailwind 4):
 *   1. `tailwind.config.ts` → `export default { presets: [preset] }`
 *   2. `globals.css`        → `@config "../../tailwind.config.ts";`
 *
 * Two rules govern everything below:
 *
 * - **Semantic before raw.** Components style themselves with `fg-*`, `bg-*`
 *   and `border-*`, which resolve to CSS variables that flip under `.dark`.
 *   Raw scales (`brand-600`, `error-50`) exist for accents that must not flip.
 * - **Additive only.** This preset never redefines a Tailwind default. The
 *   `text-xs` (291 uses), `max-w-md` (50 uses) and `shadow-xs` (13 uses)
 *   utilities already in the app keep their exact values, so adopting the
 *   preset is a no-op for existing screens.
 */

/** Raw palettes. Fixed hex — these do not flip between light and dark. */
export const palette = {
  /** Product blue. 600 is the anchor and matches the app's `--primary`. */
  brand: {
    25: "#FAFCFF",
    50: "#EFF5FF",
    100: "#DBE8FE",
    200: "#BFD7FE",
    300: "#93BDFD",
    400: "#609AFA",
    500: "#3B7BF6",
    600: "#2563EB",
    700: "#1D4FD8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },
  /** Neutral ramp tuned to the app's flat grey surface stack. */
  gray: {
    25: "#FCFCFD",
    50: "#F9F9FA",
    100: "#EFEFF0",
    200: "#E6E6E8",
    300: "#D3D3D6",
    400: "#A8A9AD",
    500: "#7E7F84",
    600: "#6F7074",
    700: "#4A4B4F",
    800: "#2A2A2B",
    900: "#1A1A1A",
  },
  error: {
    25: "#FFFBFB",
    50: "#FEF3F4",
    100: "#FDE4E7",
    200: "#FBCED4",
    300: "#F7A6B1",
    400: "#F17389",
    500: "#E5476A",
    600: "#DC4256",
    700: "#B92D45",
    800: "#9B2740",
    900: "#85253C",
  },
  warning: {
    25: "#FFFCF5",
    50: "#FFFAEB",
    100: "#FEF0C7",
    200: "#FEDF89",
    300: "#FEC84B",
    400: "#FDB022",
    500: "#F79009",
    600: "#DC6803",
    700: "#B54708",
    800: "#93370D",
    900: "#7A2E0E",
  },
  success: {
    25: "#F6FEF9",
    50: "#ECFDF3",
    100: "#D1FADF",
    200: "#A6F4C5",
    300: "#6CE9A6",
    400: "#32D583",
    500: "#12B76A",
    600: "#0F9F5F",
    700: "#027A48",
    800: "#05603A",
    900: "#054F31",
  },
} as const;

/**
 * Semantic tokens. Every value is a CSS variable declared in `globals.css`
 * for `:root` and re-declared under `.dark`, so a component written with
 * `text-fg-primary` is correct in both themes with no `dark:` variant.
 *
 * Note the utility names follow from the namespace: `fg` → `text-fg-primary`,
 * `bg` → `bg-bg-primary`, `border` → `border-border-primary`.
 */
const semantic = {
  fg: {
    primary: "var(--fg-primary)",
    secondary: "var(--fg-secondary)",
    tertiary: "var(--fg-tertiary)",
    disabled: "var(--fg-disabled)",
    brand: "var(--fg-brand)",
    error: "var(--fg-error)",
    warning: "var(--fg-warning)",
    success: "var(--fg-success)",
    "on-brand": "var(--fg-on-brand)",
  },
  bg: {
    primary: "var(--bg-primary)",
    secondary: "var(--bg-secondary)",
    tertiary: "var(--bg-tertiary)",
    disabled: "var(--bg-disabled)",
    brand: "var(--bg-brand)",
    "brand-solid": "var(--bg-brand-solid)",
    error: "var(--bg-error)",
    warning: "var(--bg-warning)",
    success: "var(--bg-success)",
    overlay: "var(--bg-overlay)",
  },
  border: {
    // `DEFAULT` keeps the app's existing `border-border` utility intact.
    DEFAULT: "var(--border)",
    primary: "var(--border-primary)",
    secondary: "var(--border-secondary)",
    disabled: "var(--border-disabled)",
    brand: "var(--border-brand)",
    error: "var(--border-error)",
  },
} as const;

const preset = {
  theme: {
    extend: {
      colors: {
        ...semantic,

        /*
         * Raw scales. `DEFAULT` and `subtle` are carried over from the app's
         * existing variables so the 176 call sites already using `text-brand`,
         * `bg-brand-subtle`, `text-success` and friends keep working unchanged.
         */
        brand: {
          ...palette.brand,
          DEFAULT: "var(--brand)",
          subtle: "var(--brand-subtle)",
        },
        gray: palette.gray,
        error: palette.error,
        warning: {
          ...palette.warning,
          DEFAULT: "var(--warning)",
          subtle: "var(--warning-subtle)",
        },
        success: {
          ...palette.success,
          DEFAULT: "var(--success)",
          subtle: "var(--success-subtle)",
        },
      },

      /*
       * Spacing is Tailwind's 4px base scale — the same grid the design system
       * is drawn on — so it is inherited rather than redefined. Named keys are
       * deliberately absent: `spacing.md` would shadow the container scale that
       * `max-w-md` and `max-w-sm` resolve from.
       */

      borderRadius: {
        // Matched to the `--radius` ladder already in `globals.css`, so these
        // are the same pixel values the app renders today.
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.375rem",
        "4xl": "1.625rem",
      },

      fontSize: {
        // Additive only. `xs`/`sm`/`lg`/`xl` keep their Tailwind defaults
        // because 291 existing `text-xs` call sites depend on that metric.
        md: ["1rem", { lineHeight: "1.5rem" }],
        "display-xs": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "display-sm": ["1.875rem", { lineHeight: "2.375rem", letterSpacing: "-0.015em" }],
        "display-md": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "3.75rem", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.025em" }],
        "display-2xl": ["4.5rem", { lineHeight: "5.625rem", letterSpacing: "-0.025em" }],
      },

      boxShadow: {
        // The app's flat-concept elevations. Named `elevation-*` rather than
        // `sm`/`md`/`lg` so Tailwind's own shadow scale is left alone.
        "elevation-low": "var(--elevation-low)",
        "elevation-mid": "var(--elevation-mid)",
        "elevation-high": "var(--elevation-high)",
      },
    },
  },
};

export default preset;
