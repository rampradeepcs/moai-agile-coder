import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

/*
 * Manrope, self-hosted as a single variable file. The axis covers 200–800,
 * which spans every weight the app uses (400/500/600/700). Manrope ships no
 * italic; nothing in the app requests one.
 */
const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "WizKraft", template: "%s · WizKraft" },
  description:
    "AI-powered agile workspace — turn what you're building into a structured ticket hierarchy your team can act on in minutes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans", manrope.variable, geistMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
