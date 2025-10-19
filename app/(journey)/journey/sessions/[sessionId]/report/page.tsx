import SessionReport from "./session-report";
// import SessionReport from "./hm";
// import SessionReport from "./vm";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;

  // return <SessionReport sessionId={sessionId} />;
  return <SessionReport sessionId={sessionId} />;
}
