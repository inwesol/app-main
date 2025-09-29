import CareerStory1 from "@/components/activity-forms/career-story-1";
import LifeCollage from "@/components/activity-forms/my-life-collage";
import CareerStory2 from "@/components/activity-forms/career-story-2";
import CareerStory3 from "@/components/activity-forms/career-story-3";
import LetterFromFutureSelf from "@/components/activity-forms/letter-from-future-self";
import CareerOptionsMatrix from "@/components/activity-forms/career-options-matrix";
import CareerStory4 from "@/components/activity-forms/career-story-4";
import CareerStory5 from "@/components/activity-forms/career-story-5";
import CareerStory6 from "@/components/activity-forms/career-story-6";
import DailyJournaling from "@/components/activity-forms/daily-journaling";

import { notFound } from "next/navigation";

interface ActivityPageProps {
  params: Promise<{
    aId: string;
    sessionId: string;
  }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const componentsMap = [
    {
      id: "career-story-1",
      Component: CareerStory1,
      session: "1",
    },
    {
      id: "life-collage",
      Component: LifeCollage,
      session: "2",
    },
    {
      id: "career-story-2",
      Component: CareerStory2,
      session: "3",
    },
    {
      id: "career-story-3",
      Component: CareerStory3,
      session: "4",
    },
    {
      id: "letter-from-future-self",
      Component: LetterFromFutureSelf,
      session: "4",
    },
    {
      id: "career-option-matrix",
      Component: CareerOptionsMatrix,
      session: "5",
    },
    {
      id: "career-story-4",
      Component: CareerStory4,
      session: "5",
    },
    {
      id: "career-story-5",
      Component: CareerStory5,
      session: "6",
    },
    {
      id: "career-story-6",
      Component: CareerStory6,
      session: "7",
    },
    {
      id: "daily-journaling",
      Component: DailyJournaling,
      session: "8",
    },
  ];

  const { sessionId, aId } = await params;
  // console.log("Activity page accessed with params:", { sessionId, aId });

  const matchedComponent = componentsMap.find(
    (comp) => comp.id === aId && sessionId === comp.session
  );

  if (!matchedComponent) {
    return notFound();
  }

  const ComponentToRender = matchedComponent.Component;

  // Handle different component prop requirements
  const sessionIdNum = Number.parseInt(sessionId);

  return <ComponentToRender />;
}
