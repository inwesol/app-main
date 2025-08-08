import CareeerStory1 from "@/components/activity-forms/CareeerStoryOne";
import { notFound } from "next/navigation";

interface PageProps {
  params: { sessionId: string; aId: string };
}
export default async function Page({ params }: PageProps) {
  const componentsMap = [
    {
      id: "career-story-1",
      Component: CareeerStory1,
    },
  ];
  console.log(await params);
  const { aId, sessionId } = await params;
  const matchedComponent = componentsMap.find((comp) => comp.id === aId);

  if (!matchedComponent) {
    return notFound();
  }

  const ComponentToRender = matchedComponent.Component;

  return <ComponentToRender sessionId={sessionId} />;
}
