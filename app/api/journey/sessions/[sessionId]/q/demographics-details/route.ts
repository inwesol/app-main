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
  { params }: { params: { sessionId: string; qId: string } }
) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });
  const { sessionId, qId } = await params;
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string; qId: string } }
) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const details = await getUserDemographics(session.user.id);

  if (!details) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(details);
}
