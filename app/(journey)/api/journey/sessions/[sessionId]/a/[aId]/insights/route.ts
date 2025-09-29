import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user_session_form_progress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; aId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, aId: formId } = await params;

    // Get the form progress record
    const formProgress = await db
      .select()
      .from(user_session_form_progress)
      .where(
        and(
          eq(user_session_form_progress.user_id, session.user.id),
          eq(
            user_session_form_progress.session_id,
            Number.parseInt(sessionId, 10)
          ),
          eq(user_session_form_progress.form_id, formId)
        )
      )
      .limit(1);

    if (formProgress.length === 0) {
      return NextResponse.json({ values: [] });
    }

    const insights = formProgress[0].insights as any;
    const values = insights?.values || [];

    return NextResponse.json({ values });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; aId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, aId: formId } = await params;
    const body = await request.json();
    const { values } = body;

    if (!Array.isArray(values)) {
      return NextResponse.json(
        { error: "values array is required" },
        { status: 400 }
      );
    }

    // Check if form progress exists
    const existingProgress = await db
      .select()
      .from(user_session_form_progress)
      .where(
        and(
          eq(user_session_form_progress.user_id, session.user.id),
          eq(
            user_session_form_progress.session_id,
            Number.parseInt(sessionId, 10)
          ),
          eq(user_session_form_progress.form_id, formId)
        )
      )
      .limit(1);

    const insights = { values };

    if (existingProgress.length > 0) {
      // Update existing record
      await db
        .update(user_session_form_progress)
        .set({
          insights,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(user_session_form_progress.user_id, session.user.id),
            eq(
              user_session_form_progress.session_id,
              Number.parseInt(sessionId, 10)
            ),
            eq(user_session_form_progress.form_id, formId)
          )
        );
    } else {
      // Create new record
      await db.insert(user_session_form_progress).values({
        user_id: session.user.id,
        session_id: Number.parseInt(sessionId, 10),
        form_id: formId,
        status: "in-progress",
        insights,
      });
    }

    return NextResponse.json({ success: true, values });
  } catch (error) {
    console.error("Error saving insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
