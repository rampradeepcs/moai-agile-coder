import { Logo } from "@/components/marketing/logo";
import { WorkflowAnimation } from "@/components/marketing/workflow-animation";

/** Star field built from stacked box-shadow dots — no external images. */
const STARS_SMALL =
  "12% 18% 0 0, 28% 8% 0 0, 44% 26% 0 0, 61% 12% 0 0, 78% 22% 0 0, 90% 9% 0 0, 8% 42% 0 0, 24% 55% 0 0, 39% 47% 0 0, 55% 60% 0 0, 70% 44% 0 0, 86% 57% 0 0, 15% 72% 0 0, 33% 84% 0 0, 50% 74% 0 0, 66% 88% 0 0, 82% 76% 0 0, 94% 90% 0 0, 5% 92% 0 0, 47% 6% 0 0";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-2">
      {/* Left — form column */}
      <div className="relative flex flex-col p-6 sm:p-8">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right — cosmic panel */}
      <div
        aria-hidden
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        style={{ backgroundColor: "oklch(0.1 0.015 262)" }}
      >
        {/* Violet radial glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 55% at 65% 30%, oklch(0.4 0.2 262 / 55%), transparent 70%), radial-gradient(45% 40% at 25% 70%, oklch(0.35 0.16 230 / 35%), transparent 70%)",
          }}
        />
        {/* Conic accents */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage:
              "conic-gradient(from 210deg at 70% 25%, transparent 0deg, oklch(0.5 0.22 262 / 30%) 60deg, transparent 130deg, oklch(0.55 0.18 220 / 18%) 220deg, transparent 300deg)",
          }}
        />
        {/* Star field */}
        <div className="absolute inset-0">
          {STARS_SMALL.split(", ").map((pos, i) => {
            const [x, y] = pos.split(" ");
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: x,
                  top: y,
                  width: i % 4 === 0 ? 2.5 : 1.5,
                  height: i % 4 === 0 ? 2.5 : 1.5,
                  backgroundColor: "white",
                  opacity: i % 3 === 0 ? 0.9 : 0.45,
                }}
              />
            );
          })}
        </div>
        {/* Horizon glow at the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{
            backgroundImage:
              "radial-gradient(80% 120% at 50% 120%, oklch(0.45 0.22 262 / 40%), transparent 70%)",
          }}
        />

        {/* Workflow animation */}
        <div className="relative flex flex-1 items-center justify-center px-12 pt-14">
          <WorkflowAnimation />
        </div>

        {/* Quote */}
        <div className="relative p-12 pb-14">
          <p
            className="max-w-md text-2xl font-semibold tracking-tight text-balance"
            style={{ color: "oklch(0.97 0.005 286)" }}
          >
            Stop spending days breaking down requirements manually.
          </p>
          <p
            className="mt-3 max-w-md text-sm leading-relaxed"
            style={{ color: "oklch(0.75 0.02 262)" }}
          >
            Get a fully structured ticket hierarchy your team can act on in minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
