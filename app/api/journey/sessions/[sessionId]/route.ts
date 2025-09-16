import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getSessionDetailForUser } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { sessionId } = await params;
  if (Number.isNaN(sessionId)) {
    return new NextResponse("Invalid session", { status: 400 });
  }
  const sessionDetail = await getSessionDetailForUser(
    session.user.id,
    Number(sessionId)
  );
  if (!sessionDetail) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.json(sessionDetail);
}
