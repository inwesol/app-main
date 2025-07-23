import { CareerMaturity } from "@/components/questionnaire-forms/career-maturity";
import { DemographicsDetailsForm } from "@/components/questionnaire-forms/demographics-details-form";
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
      id: "demographics-details",
      Component: DemographicsDetailsForm,
    },
    // {
    //   id: "pre-assesment",
    //   Component: PreAssesment,
    // },
    {
      id: "career-maturity",
      Component: CareerMaturity,
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
