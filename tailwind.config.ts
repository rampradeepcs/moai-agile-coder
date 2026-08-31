import type { Config } from "tailwindcss";
import preset from "./tailwind.preset";

/**
 * Tailwind 4 reads its theme from `@theme` in `globals.css`. This file exists
 * so the design tokens ship as a portable preset (see `tailwind.preset.ts`);
 * `globals.css` pulls it in with `@config "../../tailwind.config.ts";`.
 */
export default {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx,mdx}"],
} satisfies Config;
