import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  upsertUserDemographics,
  completeUserSessionFormProgress,
  updateJourneyProgressAfterForm,
  getUserDemographics,
  getPreAssessment,
  upsertPreAssessment,
  upsertCareerMaturityAssessment,
  getCareerMaturityAssessment,
} from "@/lib/db/queries";
import { demographicsDetailsSchema } from "@/lib/schemas/questionnaire-schemas/demographics-details-form-schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string; qId: string } }
) {
  const { qId, sessionId } = await params;
  switch (qId) {
    case "demographics-details":
      const session = await auth();
      if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

      const details = await getUserDemographics(session.user.id);

      if (!details) return new NextResponse("Not found", { status: 404 });

      return NextResponse.json(details);

    case "pre-assessment":
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
        return NextResponse.json({
          answers: data.answers,
        });
      } catch (err) {
        console.error("Error fetching pre-assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;

        console.log("Career maturity GET - Session ID:", sessionId);
        console.log("Career maturity GET - User ID:", session.user.id);

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
    default:
      return NextResponse.json({ error: "Unknown formId" }, { status: 404 });
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string; qId: string } }
) {
  const { qId, sessionId } = await params;
  switch (qId) {
    case "demographics-details":
      const session = await auth();
      if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });
      const formData = await req.json();

      const validation = demographicsDetailsSchema.safeParse(formData);
      if (!validation.success) {
        return NextResponse.json(
          { errors: validation.error.format() },
          { status: 400 }
        );
      }
      const data = validation.data;

      await upsertUserDemographics(session.user.id, data);

      // await upsertUserDemographics(session.user.id, formData);
      await completeUserSessionFormProgress({
        userId: session.user.id,
        sessionId: Number(sessionId),
        qId,
      });
      await updateJourneyProgressAfterForm(session.user.id, Number(sessionId));

      return NextResponse.json({ success: true });

    case "pre-assessment":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("server params: ", await params);
        const { sessionId, qId } = await params;
        const answers = await req.json();

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
        await upsertPreAssessment(session.user.id, sessionIdNum, answers);
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error inserting pre-assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;
        const answers = await req.json();

        console.log("Career maturity POST - Session ID:", sessionId);
        console.log("Career maturity POST - User ID:", session.user.id);
        console.log("Career maturity POST - Answers:", answers);

        const sessionIdNum = Number(sessionId);
        if (isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        if (!answers || typeof answers !== "object") {
          return new NextResponse("Bad Request: Invalid answers format", {
            status: 400,
          });
        }

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
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error in career maturity POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    default:
      return NextResponse.json({ error: "Unknown formId" }, { status: 404 });
  }
}
