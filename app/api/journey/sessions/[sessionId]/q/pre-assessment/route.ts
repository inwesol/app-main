import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { insertPreAssessment, getPreAssessment } from "@/lib/db/queries";

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
    const body = await req.json();
    const answers = body.answers;

    // Debug logging
    console.log("Pre-assessment POST - Session ID:", sessionId);
    console.log("Pre-assessment POST - User ID:", session.user.id);
    console.log("Pre-assessment POST - Answers:", answers);

    if (!answers || typeof answers !== "object") {
      return new NextResponse("Bad Request: Missing or invalid 'answers'", {
        status: 400,
      });
    }

    // Validate sessionId
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

    await insertPreAssessment(session.user.id, sessionIdNum, answers);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error inserting pre-assessment:", err);
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
    console.log("Pre-assessment GET - Session ID:", sessionId);
    console.log("Pre-assessment GET - User ID:", session.user.id);

    // Validate sessionId
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

    const data = await getPreAssessment(session.user.id, sessionIdNum);

    if (!data) {
      console.log(
        "Pre-assessment not found for user:",
        session.user.id,
        "session:",
        sessionIdNum
      );
      return new NextResponse("Not Found", { status: 404 });
    }

    console.log("Pre-assessment found:", data);

    // Return just the answers object that the frontend expects
    // Assuming your database returns { id, userId, sessionId, answers }
    // and you want to return just the answers part
    return NextResponse.json(data.answers || data);
  } catch (err) {
    console.error("Error fetching pre-assessment:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}