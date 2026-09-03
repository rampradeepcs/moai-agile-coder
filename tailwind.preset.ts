/**
 * WizKraft — Design System Tailwind preset.
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

/**
 * Raw palettes — generated from the WizKraft Figma colour styles
 * (file DTfOUMmRzfz8munYZnMkr7, frame 1:126 "Color").
 *
 * Steps run 100–1000 exactly as the design file defines them, so a value here
 * can be checked against Figma by name. `alpha10` is Figma's `Alpha/10` step:
 * the family at 10% opacity, used for subtle tints that work on any surface.
 *
 * Figma groups these by role, and that grouping drives the names below:
 *   Primary   → brand        Black/White → gray / white (neutrals)
 *   Green 1   → success      Yellow 1    → warning        Red1 → error
 *   Blue      → info         Purple / Orange / Brown / Pink → accents
 */
export const palette = {
  /** Figma "Primary". 600 is the logo green; see the note on `--primary` below. */
  brand: {
    100: "#daf9e9", 200: "#b4f2d4", 300: "#8fecbe", 400: "#6ae6a8", 500: "#44df93",
    600: "#24d47d", 700: "#1fb46a", 800: "#199558", 900: "#147545", 1000: "#0e5532",
    alpha10: "#24d47d1a",
  },
  /** Figma "Black" — the foundational neutral for text, fields and dividers. */
  gray: {
    100: "#d1d1d1", 200: "#bababa", 300: "#a3a3a3", 400: "#8d8d8d", 500: "#767676",
    600: "#5f5f5f", 700: "#484848", 800: "#313131", 900: "#1a1a1a", 1000: "#131313",
    alpha10: "#1a1a1a1a",
  },
  /** Figma "White" — the lighter neutral ramp. */
  white: {
    100: "#ffffff", 200: "#e9e9e9", 300: "#d3d3d3", 400: "#bdbdbd", 500: "#a7a7a7",
    600: "#919191", 700: "#7b7b7b", 800: "#656565", 900: "#4f4f4f", 1000: "#393939",
    alpha10: "#ffffff1a",
  },
  /** Figma "Green 1" — feedback: success. */
  success: {
    100: "#b3fede", 200: "#8dfece", 300: "#67fdbd", 400: "#40fdad", 500: "#1afd9d",
    600: "#02ee8a", 700: "#02c874", 800: "#029c5b", 900: "#017141", 1000: "#014528",
    alpha10: "#02c8741a",
  },
  /** Figma "Yellow 1" — feedback: warning. */
  warning: {
    100: "#fff4d4", 200: "#ffe9aa", 300: "#ffde7f", 400: "#ffd354", 500: "#ffc82a",
    600: "#febc00", 700: "#d8a000", 800: "#b28400", 900: "#8c6700", 1000: "#664b00",
    alpha10: "#febc001a",
  },
  /** Figma "Red1" — feedback: error. */
  error: {
    100: "#f9d2d2", 200: "#f3a6a6", 300: "#ec7979", 400: "#e64d4d", 500: "#e02020",
    600: "#c41b1b", 700: "#a71717", 800: "#8a1313", 900: "#6d0f0f", 1000: "#500b0b",
    alpha10: "#e020201a",
  },
  /** Figma "Blue" — feedback: informational. */
  info: {
    100: "#d3e0fb", 200: "#a8c1f7", 300: "#7ca1f3", 400: "#5182ef", 500: "#2563eb",
    600: "#1452d9", 700: "#1145b9", 800: "#0e3998", 900: "#0b2d78", 1000: "#082158",
    alpha10: "#2563eb1a",
  },
  /** Accents — secondary to the brand, for labels, charts and pipeline hues. */
  purple: {
    100: "#e2d3fd", 200: "#c6a6fa", 300: "#a97af8", 400: "#8d4df5", 500: "#7021f3",
    600: "#5d0ce4", 700: "#500ac2", 800: "#4209a0", 900: "#34077e", 1000: "#26055c",
    alpha10: "#7021f31a",
  },
  orange: {
    100: "#fee9d3", 200: "#fdd3a7", 300: "#fbbc7a", 400: "#faa64e", 500: "#f99022",
    600: "#f07e07", 700: "#cc6b06", 800: "#a85805", 900: "#844504", 1000: "#603303",
    alpha10: "#f990221a",
  },
  brown: {
    100: "#ecd2bf", 200: "#e2bb9f", 300: "#d9a57f", 400: "#cf8e5f", 500: "#c6773f",
    600: "#a96433", 700: "#895129", 800: "#6c4020", 900: "#4e2e17", 1000: "#311d0f",
    alpha10: "#8951291a",
  },
  pink: {
    100: "#ffcfef", 200: "#ffa0df", 300: "#ff70cf", 400: "#ff40bf", 500: "#ff1bb3",
    600: "#f600a3", 700: "#d1008b", 800: "#ac0073", 900: "#88005a", 1000: "#630042",
    alpha10: "#ff40bf1a",
  },
} as const;

/** Figma "BG COLORS" — the two ground fills the artboards are built on. */
export const surfaces = {
  artboard: "#f9f9fa",
  pill: "#efeff0",
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
         * Raw scales, straight from Figma. `DEFAULT` and `subtle` are kept on
         * the families the app already references by bare name (`text-brand`,
         * `bg-success-subtle`, …) so those call sites keep resolving to the
         * theme-aware CSS variables rather than a fixed step.
         */
        brand: {
          ...palette.brand,
          DEFAULT: "var(--brand)",
          subtle: "var(--brand-subtle)",
        },
        gray: palette.gray,
        // `DEFAULT` keeps Tailwind's scalar `bg-white` / `text-white` working.
        white: { ...palette.white, DEFAULT: "#ffffff" },
        error: {
          ...palette.error,
          DEFAULT: "var(--danger)",
          subtle: "var(--danger-subtle)",
        },
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
        info: {
          ...palette.info,
          DEFAULT: "var(--info)",
          subtle: "var(--info-subtle)",
        },
        purple: palette.purple,
        orange: palette.orange,
        brown: palette.brown,
        pink: {
          ...palette.pink,
          DEFAULT: "var(--pink)",
          subtle: "var(--pink-subtle)",
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
