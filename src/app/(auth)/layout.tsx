import Image from "next/image";

import { SparkleField } from "@/components/auth/sparkle-field";

/*
 * Auth shell from the WizKraft Figma auth frames: a dotted #f9f9fa ground with
 * a sparkle cluster behind a centred card, a wizard staff at the upper left and
 * a swoosh at the lower right. Every auth route renders its card as `children`.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 sm:py-10">
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--foreground) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Sparkle cluster behind the card — each element drifts or turns */}
      <SparkleField className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[687px] w-[734px] -translate-x-1/2 -translate-y-1/2 sm:block" />

      {/* Corner marks */}
      <Image
        aria-hidden
        src="/auth/wizard-staff.svg"
        alt=""
        width={60}
        height={60}
        className="pointer-events-none absolute top-[211px] left-20 hidden lg:block"
      />
      <Image
        aria-hidden
        src="/auth/swoosh.svg"
        alt=""
        width={79}
        height={76}
        className="pointer-events-none absolute right-[70px] bottom-[70px] hidden lg:block"
      />

      <div className="relative w-full max-w-[600px]">{children}</div>
    </div>
  );
}
