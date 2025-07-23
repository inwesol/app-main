import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { insertPreAssessment, getPreAssessment } from "@/lib/db/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { sessionId } = await params;
  // Request body expected to be { answers: { [key:string]: number } }
  const body = await req.json();
  const answers = body.answers;

  if (!answers || typeof answers !== "object") {
    return new NextResponse("Bad Request: Missing or invalid 'answers'", {
      status: 400,
    });
  }

  try {
    await insertPreAssessment(session.user.id, Number(sessionId), answers);
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
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { sessionId } = await params;

  try {
    const data = await getPreAssessment(session.user.id, Number(sessionId));

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching pre-assessment:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
