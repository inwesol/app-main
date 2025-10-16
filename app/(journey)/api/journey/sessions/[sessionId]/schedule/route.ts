import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { user_session_form_progress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { session_datetime } = body;

    if (!session_datetime) {
      return NextResponse.json(
        { error: "session_datetime is required" },
        { status: 400 }
      );
    }

    // Validate session_datetime format and ensure it's in the future
    const scheduledDate = new Date(session_datetime);
    const now = new Date();

    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid session_datetime format" },
        { status: 400 }
      );
    }

    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: "Session must be scheduled in the future" },
        { status: 400 }
      );
    }

    // Check if scheduling request already exists
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
          eq(user_session_form_progress.form_id, "schedule-call")
        )
      )
      .limit(1);

    const insights = {
      session_datetime: session_datetime,
      scheduled_at: new Date().toISOString(),
    };

    if (existingProgress.length > 0) {
      // Update existing record
      await db
        .update(user_session_form_progress)
        .set({
          status: "pending",
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
            eq(user_session_form_progress.form_id, "schedule-call")
          )
        );
    } else {
      // Create new record
      await db.insert(user_session_form_progress).values({
        user_id: session.user.id,
        session_id: Number.parseInt(sessionId, 10),
        form_id: "schedule-call",
        status: "pending",
        insights,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Schedule request submitted successfully",
      insights,
    });
  } catch (error) {
    console.error("Error submitting schedule request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    // Update the scheduling progress record
    await db
      .update(user_session_form_progress)
      .set({
        status: status,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(user_session_form_progress.user_id, session.user.id),
          eq(
            user_session_form_progress.session_id,
            Number.parseInt(sessionId, 10)
          ),
          eq(user_session_form_progress.form_id, "schedule-call")
        )
      );

    // If status is "completed", also update the form status to "completed"
    if (status === "completed") {
      await db
        .update(user_session_form_progress)
        .set({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date(),
        })
        .where(
          and(
            eq(user_session_form_progress.user_id, session.user.id),
            eq(
              user_session_form_progress.session_id,
              Number.parseInt(sessionId, 10)
            ),
            eq(user_session_form_progress.form_id, "schedule-call")
          )
        );
    }

    return NextResponse.json({
      success: true,
      message: "Session status updated successfully",
      status,
    });
  } catch (error) {
    console.error("Error updating session status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Get the scheduling progress record
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
          eq(user_session_form_progress.form_id, "schedule-call")
        )
      )
      .limit(1);

    if (formProgress.length === 0) {
      return NextResponse.json({
        scheduling_status: "not_scheduled",
        insights: {},
      });
    }

    const insights = formProgress[0].insights as any;
    const status = formProgress[0].status;

    return NextResponse.json({
      scheduling_status: status,
      insights,
    });
  } catch (error) {
    console.error("Error fetching scheduling status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
