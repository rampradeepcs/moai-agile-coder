"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Check, Dog, Heart, Loader2, PawPrint, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

/* Deliberate fixed colors — these are generated brand candidates (content),
   not UI chrome, so they stay identical in both themes. */
const LOGO_TILES = [
  { id: "black-paw", bg: "#18181b", fg: "#fafafa", Icon: PawPrint },
  { id: "white-paw", bg: "#fafafa", fg: "#18181b", Icon: PawPrint, bordered: true },
  { id: "blue-heart", bg: "#2563eb", fg: "#ffffff", Icon: Heart },
  { id: "yellow-dog", bg: "#facc15", fg: "#1c1917", Icon: Dog },
  { id: "green-paw", bg: "#16a34a", fg: "#ffffff", Icon: PawPrint },
  { id: "red-heart", bg: "#dc2626", fg: "#ffffff", Icon: Heart },
  { id: "orange-dog", bg: "#ea580c", fg: "#ffffff", Icon: Dog },
  { id: "pink-paw", bg: "#ec4899", fg: "#ffffff", Icon: PawPrint },
  { id: "violet-heart", bg: "#7c3aed", fg: "#ffffff", Icon: Heart },
  { id: "teal-dog", bg: "#0d9488", fg: "#ffffff", Icon: Dog },
];

const THEMES = [
  {
    id: "from-logo",
    name: "From Logo",
    bg: "#fff7ed",
    fg: "#431407",
    muted: "#9a6b52",
    primary: "#ea580c",
    accent: "#facc15",
    border: "#f5d9c2",
  },
  {
    id: "green",
    name: "Green Theme",
    bg: "#f0fdf4",
    fg: "#14532d",
    muted: "#5b8a6d",
    primary: "#16a34a",
    accent: "#0d9488",
    border: "#cdebd7",
  },
  {
    id: "default-dark",
    name: "Default dark",
    bg: "#131316",
    fg: "#fafafa",
    muted: "#9c9ca6",
    primary: "#8b5cf6",
    accent: "#ec4899",
    border: "#2c2c33",
  },
];

const FONTS = [
  { id: "sans", label: "Geist Sans", className: "font-sans" },
  { id: "serif", label: "Serif", style: { fontFamily: "Georgia, 'Times New Roman', serif" } },
  { id: "mono", label: "Mono", className: "font-mono" },
  { id: "abeezee", label: "ABeeZee", style: { fontFamily: "'ABeeZee', system-ui, sans-serif" } },
  { id: "abhaya", label: "Abhaya Libre", style: { fontFamily: "'Abhaya Libre', Georgia, serif" } },
  { id: "quicksand", label: "Quicksand", style: { fontFamily: "'Quicksand', system-ui, sans-serif" } },
  { id: "acme", label: "Acme", style: { fontFamily: "'Acme', system-ui, sans-serif" } },
  { id: "actor", label: "Actor", style: { fontFamily: "'Actor', system-ui, sans-serif" } },
];

const ICON_SETS = [
  "Lucide icons",
  "Hero icons",
  "Font awesome",
  "Material symbols",
  "Phosphor icons",
  "Remix icons",
  "Tabler icons",
  "Ion icons",
  "Eva icons",
  "Feather icons",
  "Bootstrap icons",
  "Radix icons",
  "Iconoir",
  "Streamline icons",
];

export function DesignDoc({ onApprove }: { onApprove: () => void }) {
  const [generating, setGenerating] = React.useState(true);
  const [logo, setLogo] = React.useState("black-paw");
  const [theme, setTheme] = React.useState("from-logo");
  const [font, setFont] = React.useState("sans");
  const [iconSet, setIconSet] = React.useState("Lucide icons");
  const [regenTarget, setRegenTarget] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (generating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Generating design document…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-3xl px-6 py-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">PawCare — Design Document</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick the visual identity for your app — everything can be changed later.
          </p>

          <div className="mt-6 space-y-4 pb-8">
            {/* Logo */}
            <section className="rounded-xl border bg-card p-5 shadow-elevation-low">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold tracking-tight">Logo</h2>
                <Button variant="ghost" size="xs" onClick={() => setRegenTarget("logo options")}>
                  <Sparkles />
                  Regenerate
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-10">
                {LOGO_TILES.map(({ id, bg, fg, Icon, bordered }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLogo(id)}
                    aria-label={`Logo option ${id.replace("-", " ")}`}
                    aria-pressed={logo === id}
                    className={cn(
                      "flex size-16 items-center justify-center rounded-xl transition-all",
                      bordered && "border",
                      logo === id
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    <Icon className="size-7" />
                  </button>
                ))}
              </div>
            </section>

            {/* Color theory */}
            <section className="rounded-xl border bg-card p-5 shadow-elevation-low">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold tracking-tight">Color theory</h2>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setRegenTarget("color themes")}
                >
                  <Sparkles />
                  Regenerate
                </Button>
              </div>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="mt-4 grid gap-3 sm:grid-cols-3"
              >
                {THEMES.map((t) => (
                  <label
                    key={t.id}
                    className={cn(
                      "cursor-pointer rounded-xl border p-3 transition-all",
                      theme === t.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "hover:border-primary/40"
                    )}
                  >
                    <div
                      className="rounded-lg p-3"
                      style={{
                        backgroundColor: t.bg,
                        color: t.fg,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <p className="text-sm font-semibold">Title</p>
                      <p className="mt-0.5 truncate text-[11px]" style={{ color: t.muted }}>
                        Lorem ipsum dolor sit amet elit.
                      </p>
                      <div className="mt-2.5 flex gap-1.5">
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: t.primary, color: "#ffffff" }}
                        >
                          Primary
                        </span>
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: t.accent, color: t.id === "from-logo" ? "#431407" : "#ffffff" }}
                        >
                          Accent
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <RadioGroupItem value={t.id} id={`theme-${t.id}`} />
                      <span className="text-sm font-medium">{t.name}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </section>

            {/* Typography */}
            <section className="rounded-xl border bg-card p-5 shadow-elevation-low">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold tracking-tight">Typography</h2>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setRegenTarget("font suggestions")}
                >
                  <Sparkles />
                  Regenerate
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFont(f.id)}
                    aria-pressed={font === f.id}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-all",
                      f.className,
                      font === f.id
                        ? "border-primary bg-brand-subtle font-medium text-brand ring-1 ring-primary/40"
                        : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                    style={f.style}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Icons */}
            <section className="rounded-xl border bg-card p-5 shadow-elevation-low">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold tracking-tight">Icons</h2>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setRegenTarget("icon set suggestions")}
                >
                  <Sparkles />
                  Regenerate
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {ICON_SETS.map((set) => (
                  <button
                    key={set}
                    type="button"
                    onClick={() => setIconSet(set)}
                    aria-pressed={iconSet === set}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-sm transition-all",
                      iconSet === set
                        ? "border-primary bg-brand-subtle font-medium text-brand ring-1 ring-primary/40"
                        : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {iconSet === set && <span aria-hidden className="text-[9px]">●</span>}
                    {set}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-end gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => setRegenTarget("the entire document")}>
            <RefreshCw />
            Regenerate document
          </Button>
          <Button onClick={onApprove}>
            <Check />
            Approve
          </Button>
        </div>
      </div>

      {/* Regenerate warning */}
      <AlertDialog open={regenTarget !== null} onOpenChange={(o) => !o && setRegenTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate with AI?</AlertDialogTitle>
            <AlertDialogDescription>
              Regenerating {regenTarget} will consume AI tokens from your workspace
              allowance. The current options will be replaced.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRegenTarget(null);
                toast.success("Regenerated with the latest context");
              }}
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
