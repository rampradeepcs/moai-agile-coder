import { Box, Dumbbell, Flower2, PawPrint, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const logoIcons: Record<string, LucideIcon> = {
  "paw-print": PawPrint,
  flower: Flower2,
  dumbbell: Dumbbell,
};

const sizes = {
  sm: { box: "size-6 rounded-lg", icon: "size-3.5" },
  md: { box: "size-8 rounded-xl", icon: "size-4" },
  lg: { box: "size-10 rounded-xl", icon: "size-5" },
} as const;

export function ProjectLogo({
  project,
  size = "md",
  className,
}: {
  project: Project;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const Icon = (project.logo && logoIcons[project.logo.icon]) || Box;
  const s = sizes[size];
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center text-white shadow-elevation-low", s.box, className)}
      style={{
        backgroundImage: project.logo
          ? `linear-gradient(135deg, ${project.logo.from}, ${project.logo.to})`
          : undefined,
        backgroundColor: project.logo ? undefined : "var(--brand)",
      }}
    >
      <Icon className={s.icon} />
    </span>
  );
}
