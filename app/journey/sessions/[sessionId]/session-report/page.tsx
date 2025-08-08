import SessionReport from "./session-report";

interface SessionPageProps {
  params: { sessionId: string };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;

  return <SessionReport sessionId={sessionId} />;
}
