import { notFound } from "next/navigation";
import Session from "./session";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const validSessions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  if (!validSessions.includes(+sessionId)) {
    notFound();
  }
  return <Session />;
}
