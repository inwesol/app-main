import { notFound } from "next/navigation";

interface Params {
  sessionId: string;
  qId: string;
}
interface PageProps {
  params: Params;
}
export default async function Page({ params }: PageProps) {
  const componentsMap = [
    {
      id: "career-story-1",
      Component: CareerStory1,
    },
  ];
  console.log(await params);
  const { qId } = await params;
  const matchedComponent = componentsMap.find((comp) => comp.id === qId);

  if (!matchedComponent) {
    return notFound();
  }

  const ComponentToRender = matchedComponent.Component;

  return <ComponentToRender />;
}
