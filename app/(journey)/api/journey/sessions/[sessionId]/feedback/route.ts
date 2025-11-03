// app/api/feedback/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db"; // Adjust path to your database connection
import { feedback } from "@/lib/db/schema"; // Adjust path to your schema
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { completeUserSessionFormProgress } from "@/lib/db/queries";

// Validation schema for the incoming request
const feedbackRequestSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  overallFeeling: z
    .array(z.string())
    .min(1, "At least one feeling is required"),
  keyInsight: z.string().min(10, "Key insight must be at least 10 characters"),
  overallRating: z
    .number()
    .int()
    .min(1)
    .max(5, "Rating must be between 1 and 5"),
  wouldRecommend: z.boolean(),
  sessionId: z.number().int(), // No range validation required
});

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API: Feedback submission started");

    // Check authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();
    console.log("📋 API: Raw request body:", body);

    const validatedData = feedbackRequestSchema.parse(body);
    console.log("✅ API: Validation passed:", validatedData);

    // Prepare data for database insertion
    const insertData = {
      userId: validatedData.userId,
      sessionId: validatedData.sessionId,
      overallFeeling: validatedData.overallFeeling,
      keyInsight: validatedData.keyInsight,
      overallRating: validatedData.overallRating,
      wouldRecommend: validatedData.wouldRecommend,
      // createdAt and updatedAt will be set automatically by the database defaults
    };

    console.log("💾 API: Inserting data into database:", insertData);

    // Insert into database
    const result = await db.insert(feedback).values(insertData).returning({
      id: feedback.id,
      sessionId: feedback.sessionId,
      createdAt: feedback.createdAt,
    });

    console.log("✅ API: Database insertion successful:", result[0]);

    // Complete the form progress
    await completeUserSessionFormProgress({
      userId: session.user.id,
      sessionId: validatedData.sessionId,
      qId: "feedback",
    });

    console.log("✅ API: Form progress updated successfully");

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data: {
          id: result[0].id,
          sessionId: result[0].sessionId,
          submittedAt: result[0].createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ API: Error processing feedback:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    if (error && typeof error === "object" && "code" in error) {
      console.error("💾 API: Database error code:", error.code);

      // Handle specific database error codes
      switch (error.code) {
        case "23505": // Unique violation
          return NextResponse.json(
            {
              success: false,
              error: "Duplicate feedback submission detected",
            },
            { status: 409 }
          );
        case "23503": // Foreign key violation
          return NextResponse.json(
            {
              success: false,
              error: "Invalid user ID or session reference",
            },
            { status: 400 }
          );
        default:
          return NextResponse.json(
            {
              success: false,
              error: "Database error occurred",
            },
            { status: 500 }
          );
      }
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to retrieve feedback
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = session.user.id;

    // Build where conditions array
    const whereConditions = [eq(feedback.userId, userId)];

    if (sessionId !== null) {
      const sessionIdNum = Number.parseInt(sessionId);
      if (!Number.isNaN(sessionIdNum)) {
        whereConditions.push(eq(feedback.sessionId, sessionIdNum));
      }
    }

    // Apply all conditions at once using 'and'
    const results = await db
      .select()
      .from(feedback)
      .where(
        whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
      )
      .orderBy(desc(feedback.createdAt));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("❌ API: Error retrieving feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove feedback
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const feedbackId = searchParams.get("id");
    const userId = session.user.id;

    if (!feedbackId) {
      return NextResponse.json(
        { success: false, error: "Feedback ID is required" },
        { status: 400 }
      );
    }

    // Verify the feedback belongs to the user before deleting
    const existingFeedback = await db
      .select()
      .from(feedback)
      .where(and(eq(feedback.id, feedbackId), eq(feedback.userId, userId)))
      .limit(1);

    if (existingFeedback.length === 0) {
      return NextResponse.json(
        { success: false, error: "Feedback not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the feedback
    await db
      .delete(feedback)
      .where(and(eq(feedback.id, feedbackId), eq(feedback.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
      data: { id: feedbackId },
    });
  } catch (error) {
    console.error("❌ API: Error deleting feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
