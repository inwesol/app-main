import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  getUserJourneyProgress,
  createUserJourneyProgress,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const session = await auth();
  // console.log("auth:", await auth());
  if (!session || !session.user || !session.user.id)
    return new NextResponse("Unauthorized", { status: 401 });

  // 1. Try to fetch
  let progress = await getUserJourneyProgress(session.user.id);

  // 2. If not found, CREATE the row with safe defaults
  if (!progress) {
    // --- Default progress
    progress = await createUserJourneyProgress({
      userId: session.user.id,
      currentSession: 0,
      completedSessions: [],
      totalScore: 0,
      lastActiveDate: new Date().toISOString(),
    });
  }
  return NextResponse.json(progress);
}
