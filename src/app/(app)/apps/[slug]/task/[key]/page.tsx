import { notFound } from "next/navigation";
import { projects, workItemByKey, workItems } from "@/lib/data";
import { TaskFullView } from "@/components/work/task-full-view";

export function generateStaticParams() {
  return projects.flatMap((p) => workItems.map((w) => ({ slug: p.slug, key: w.key })));
}

export default async function TaskPage({
  params,
}: {
  params: Promise<{ slug: string; key: string }>;
}) {
  const { slug, key } = await params;
  const item = workItemByKey(decodeURIComponent(key));
  if (!item) notFound();

  return <TaskFullView item={item} slug={slug} />;
}
