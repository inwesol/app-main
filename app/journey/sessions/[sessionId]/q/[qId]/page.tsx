import { CareerMaturity } from "@/components/questionnaire-forms/career-maturity";
import { DemographicsDetailsForm } from "@/components/questionnaire-forms/demographics-details-form";
import { PreAssessment } from "@/components/questionnaire-forms/pre-assessment";
import { notFound } from "next/navigation";

interface PageProps {
  params: { qId: string; sessionId: string };
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
  ];
  console.log(await params);
  const { qId, sessionId } = await params;
  const matchedComponent = componentsMap.find(
    (comp) => comp.id === qId && sessionId === comp.session
  );

  if (!matchedComponent) {
    return notFound();
  }

  const ComponentToRender = matchedComponent.Component;

  return <ComponentToRender sessionId={sessionId} />;
}
