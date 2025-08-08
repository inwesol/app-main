import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  upsertCareerMaturityAssessment,
  getCareerMaturityAssessment,
} from "@/lib/db/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;
    const answers = await req.json();

    // Debug logging
    console.log("Career maturity POST - Session ID:", sessionId);
    console.log("Career maturity POST - User ID:", session.user.id);
    console.log("Career maturity POST - Answers:", answers);

    // Validate sessionId
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

    // Validate answers object
    if (!answers || typeof answers !== "object") {
      return new NextResponse("Bad Request: Invalid answers format", {
        status: 400,
      });
    }

    // Check if answers is empty
    if (Object.keys(answers).length === 0) {
      return new NextResponse("Bad Request: No answers provided", {
        status: 400,
      });
    }

    await upsertCareerMaturityAssessment(
      session.user.id,
      sessionIdNum,
      answers
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in career maturity POST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;

    // Debug logging
    console.log("Career maturity GET - Session ID:", sessionId);
    console.log("Career maturity GET - User ID:", session.user.id);

    // Validate sessionId
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

    const data = await getCareerMaturityAssessment(
      session.user.id,
      sessionIdNum
    );

    if (!data) {
      console.log(
        "Career maturity assessment not found for user:",
        session.user.id,
        "session:",
        sessionIdNum
      );
      return new NextResponse("Not found", { status: 404 });
    }

    console.log("Career maturity assessment found:", data);

    // Return the answers object that the frontend expects
    // Assuming your database returns { id, userId, sessionId, answers }
    return NextResponse.json(data.answers || data);
  } catch (error) {
    console.error("Error in career maturity GET:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}