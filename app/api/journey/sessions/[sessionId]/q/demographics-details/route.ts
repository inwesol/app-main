import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  upsertUserDemographics,
  completeUserSessionFormProgress,
  updateJourneyProgressAfterForm,
  getUserDemographics,
} from "@/lib/db/queries";
import { demographicsDetailsSchema } from "@/lib/schemas/questionnaire-schemas/demographics-details-form-schema";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; qId?: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId, qId } = await params;
    const formData = await req.json();

    // Use a default qId if not provided
    const questionId = qId || "demographics-details";

    // Debug logging
    console.log("Session ID:", sessionId);
    console.log("Question ID:", questionId);
    console.log("User ID:", session.user.id);
    console.log("Form data received:", formData);

    // Validate the form data
    const validation = demographicsDetailsSchema.safeParse(formData);
    if (!validation.success) {
      console.log("Validation errors:", validation.error.format());
      return NextResponse.json(
        { errors: validation.error.format() },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    console.log("Validated data:", validatedData);

    // Parse sessionId to number and validate
    const sessionIdNum = Number(sessionId);
    if (Number.isNaN(sessionIdNum)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Only call upsertUserDemographics ONCE with validated data
    await upsertUserDemographics(session.user.id, validatedData);

    // Complete the form progress
    await completeUserSessionFormProgress({
      userId: session.user.id,
      sessionId: sessionIdNum,
      qId: questionId,
    });

    // Update journey progress
    await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in demographics-details POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; qId?: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const details = await getUserDemographics(session.user.id);

    if (!details) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(details);
  } catch (error) {
    console.error("Error in demographics-details GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
