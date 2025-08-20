import CareerOptionsMatrix from "@/app/career-options-matrix/career-options-matrix";
import CareerStory1 from "@/app/career-story-1/career-story-1";
import CareerStoryTwo from "@/app/career-story-2/career-story-2";
import CareerStoryThree from "@/app/career-story-3/career-story-3";
import CareerStory4 from "@/app/career-story-4/career-story-4";
import { CareerStoryFive } from "@/app/career-story-5/career-story-5";
import { CareerStorySix } from "@/app/career-story-6/career-story-6";
import { DailyJournaling } from "@/app/daily-journaling/daily-journaling";
import LetterFromFutureSelf from "@/app/letter-from-future-self/letter-from-future-self";
import { LifeCollage } from "@/app/my-life-collage/my-life-collage";

interface ActivityPageProps {
  params: {
    sessionId: string;
    aId: string;
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  // Await params as per Next.js 15+ requirements
  const { sessionId, aId } = await params;

  console.log("Activity page accessed with params:", { sessionId, aId });

  const sessionIdNum = parseInt(sessionId);

  // Route to correct activity component based on aId
  switch (aId) {
    case "career-story-1":
      return <CareerStory1 />;

    case "career-story-2":
      return <CareerStoryTwo />;

    case "career-story-3":
      return <CareerStoryThree />;

    case "career-story-4":
      return <CareerStory4 sessionId={sessionIdNum} activityId={aId} />;

    case "career-story-5":
      return <CareerStoryFive sessionId={sessionIdNum} />;

    case "career-story-6":
      return <CareerStorySix sessionId={sessionIdNum} />;

    case "daily-journaling":
      return <DailyJournaling />;

    case "letter-from-future-self":
      return <LetterFromFutureSelf sessionId={sessionIdNum} activityId={aId} />;

    case "career-option-matrix":
      return <CareerOptionsMatrix sessionId={sessionIdNum} activityId={aId} />;

    case "life-collage":
      return <LifeCollage />;
  }
}
