import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chat_feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    console.log("Feedback API called");

    const body = await request.json();
    console.log("Request body:", body);

    const { chatId, rating, comment } = body;

    // Validate required fields
    if (!chatId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: chatId and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // For now, use a dummy email until auth is working
    const userEmail = "test@example.com";

    // Check if feedback already exists for this chat
    const existingFeedback = await db
      .select()
      .from(chat_feedback)
      .where(eq(chat_feedback.chat_id, chatId))
      .limit(1);

    if (existingFeedback.length > 0) {
      return NextResponse.json(
        { error: "Feedback already submitted for this chat" },
        { status: 409 }
      );
    }

    // Insert new feedback
    const newFeedback = await db
      .insert(chat_feedback)
      .values({
        chat_id: chatId,
        user_email: userEmail,
        rating: rating,
        comment: comment || null,
      })
      .returning();

    console.log("Feedback inserted:", newFeedback);

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        feedback: newFeedback[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting chat feedback:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId parameter is required" },
        { status: 400 }
      );
    }

    // Get feedback for specific chat
    const feedback = await db
      .select()
      .from(chat_feedback)
      .where(eq(chat_feedback.chat_id, chatId))
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        feedback: feedback[0] || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chat feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
