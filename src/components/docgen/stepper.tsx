import { cn } from "@/lib/utils";

/*
 * Creation progress bar from the WizKraft Figma app layout (file
 * DTfOUMmRzfz8munYZnMkr7, node 22:1463): four 200px steps joined by 50px
 * rules. The current step numbers into a filled brand chip; the rest carry a
 * plain numeral, and their caption drops a step down the grey ramp.
 */
export const DOCGEN_STEPS = [
  { label: "Basic details", hint: "Set the foundation" },
  { label: "Requirement gatherings", hint: "Shape your vision" },
  { label: "Requirement document", hint: "Define what matters" },
  { label: "Design document", hint: "Bring it to life" },
] as const;

export function DocgenStepper({
  current,
  className,
}: {
  current: number;
  className?: string;
}) {
  return (
    <ol
      className={cn("flex items-center gap-2", className)}
      aria-label="Creation progress"
    >
      {DOCGEN_STEPS.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        const marked = state !== "todo";
        return (
          <li key={step.label} className="flex items-center gap-2">
            {i > 0 && (
              <span
                aria-hidden
                className="hidden h-px w-[50px] shrink-0 bg-border sm:block"
              />
            )}
            <div
              className="flex w-[140px] shrink-0 flex-col items-center justify-center gap-1 lg:w-[200px]"
              aria-current={state === "active" ? "step" : undefined}
            >
              <span
                className={cn(
                  "grid size-5 place-items-center rounded text-overline-1",
                  marked ? "bg-brand-600 text-white" : "text-gray-500",
                )}
              >
                {i + 1}
              </span>
              <span className="flex flex-col text-center">
                <span
                  className={cn(
                    "text-caption-1",
                    state === "active"
                      ? "text-brand-600"
                      : state === "done"
                        ? "text-gray-900"
                        : "text-gray-500",
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "text-overline-1",
                    marked ? "text-gray-1000" : "text-gray-300",
                  )}
                >
                  {step.hint}
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
