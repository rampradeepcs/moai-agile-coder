import { notFound } from "next/navigation";
import { projects } from "@/lib/data";
import { ProjectTopbar } from "@/components/shell/project-topbar";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/apps/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <ProjectTopbar project={project} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
