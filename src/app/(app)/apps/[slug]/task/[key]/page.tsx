import { notFound } from "next/navigation";
import { workItemByKey } from "@/lib/data";
import { TaskFullView } from "@/components/work/task-full-view";

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
