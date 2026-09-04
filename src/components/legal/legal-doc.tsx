import Link from "next/link";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";

export interface LegalSection {
  /** Anchor target, also used by the contents list. */
  id: string;
  title: string;
  body: React.ReactNode;
}

export interface LegalDocProps {
  title: string;
  /** One-line summary shown under the title. */
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Shell for the Terms and Privacy pages: brand header, contents list built
 * from the sections themselves, then the sections. Keeping the contents
 * derived means it cannot drift out of sync with the document.
 */
export function LegalDoc({ title, summary, lastUpdated, sections }: LegalDocProps) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-5">
          <Logo />
          <Link
            href="/"
            className="rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{summary}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </p>

        <nav aria-labelledby="contents" className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 id="contents" className="text-sm font-semibold text-foreground">
            Contents
          </h2>
          <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id} className="text-sm">
                <a
                  href={`#${section.id}`}
                  className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand-600/50 focus-visible:outline-none"
                >
                  <span className="tabular-nums">{i + 1}.</span> {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                <span className="tabular-nums text-muted-foreground">{i + 1}.</span>{" "}
                {section.title}
              </h2>
              <div className="mt-3 flex flex-col gap-3 text-base leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">© 2026 WizKraft</p>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** Bulleted list shared by both documents. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="ml-5 flex list-disc flex-col gap-2 marker:text-border">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * A value that must be filled in before publication — company entity,
 * jurisdiction, and so on. Deliberately tinted so an unfinished document is
 * obvious on the page rather than only in the source.
 */
export function Fill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <mark
      className={cn(
        "rounded bg-warning-100 px-1 py-0.5 font-medium text-warning-900",
        className,
      )}
    >
      {children}
    </mark>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
