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
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const { sessionId } = await params;
  const answers = await req.json();

  await upsertCareerMaturityAssessment(
    session.user.id,
    Number(sessionId),
    answers
  );

  return NextResponse.json({ success: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await auth();
  if (!session?.user?.id)
    return new NextResponse("Unauthorized", { status: 401 });

  const { sessionId } = await params;
  const data = await getCareerMaturityAssessment(
    session.user.id,
    Number(sessionId)
  );

  if (!data) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(data);
}
