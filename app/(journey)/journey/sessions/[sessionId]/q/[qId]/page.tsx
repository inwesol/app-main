import { CareerMaturity } from "@/components/questionnaire-forms/career-maturity";
import { DemographicsDetailsForm } from "@/components/questionnaire-forms/demographics-details-form";
import PersonalityTest from "@/components/questionnaire-forms/personality-test";
import { PreAssessment } from "@/components/questionnaire-forms/pre-assessment";
import PsychologicalWellbeing from "@/components/questionnaire-forms/psychological-wellbeing";
import RiasecTest from "@/components/questionnaire-forms/riasecTest";
import { notFound } from "next/navigation";
import { PostCareerMaturity } from "@/components/questionnaire-forms/post-career-maturity";
import PostPsychologicalWellbeing from "@/components/questionnaire-forms/post-psychological-wellbeing";
import { PostCoachingTest } from "@/components/questionnaire-forms/post-coaching";
import PreCoachingSDQ from "@/components/questionnaire-forms/pre-coaching-sdq";
import PostCoachingSDQ from "@/components/questionnaire-forms/post-coaching-sdq";

interface PageProps {
  params: Promise<{
    qId: string;
    sessionId: string;
  }>;
}
export default async function Page({ params }: PageProps) {
  const componentsMap = [
    {
      id: "demographics-details",
      Component: DemographicsDetailsForm,
      session: "0",
    },
    {
      id: "pre-assessment",
      Component: PreAssessment,
      session: "1",
    },
    {
      id: "career-maturity",
      Component: CareerMaturity,
      session: "1",
    },
    {
      id: "psychological-wellbeing",
      Component: PsychologicalWellbeing,
      session: "1",
    },
    {
      id: "pre-coaching-strength-difficulty",
      Component: PreCoachingSDQ,
      session: "1",
    },
    {
      id: "riasec-test",
      Component: RiasecTest,
      session: "2",
    },
    {
      id: "personality-test",
      Component: PersonalityTest,
      session: "2",
    },
    {
      id: "post-coaching",
      Component: PostCoachingTest,
      session: "8",
    },
    {
      id: "post-career-maturity",
      Component: PostCareerMaturity,
      session: "8",
    },
    {
      id: "post-psychological-wellbeing",
      Component: PostPsychologicalWellbeing,
      session: "8",
    },
    {
      id: "post-coaching-strength-difficulty",
      Component: PostCoachingSDQ,
      session: "8",
    },
  ];

  const { qId, sessionId } = await params;
  // console.log("Questionnaire page accessed with params:", { sessionId, qId });

  const matchedComponent = componentsMap.find(
    (comp) => comp.id === qId && sessionId === comp.session
  );

  if (!matchedComponent) {
    return notFound();
  }

  const ComponentToRender = matchedComponent.Component;

  return <ComponentToRender sessionId={sessionId} />;
}
