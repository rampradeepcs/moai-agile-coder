import { workItemByKey, workItems } from "@/lib/data";
import { StoryView } from "@/components/story/story-view";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const item = workItemByKey(decodeURIComponent(id)) ?? workItems[0];

  return <StoryView slug={slug} item={item} />;
}
