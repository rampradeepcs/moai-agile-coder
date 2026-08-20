import { cn } from "@/lib/utils";

/** Card wrapper used by every settings section. */
export function SettingsCard({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl bg-card shadow-soft", className)}>
      <div className="border-b px-5 py-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-4 px-5 py-4">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t px-5 py-3">{footer}</div>}
    </section>
  );
}

/** A single labelled row with a trailing control (switch, select, button). */
export function SettingsRow({
  title,
  description,
  control,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
