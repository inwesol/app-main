// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust path to your database connection
import { feedback } from "@/lib/db/schema"; // Adjust path to your schema
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";

// Validation schema for the incoming request
const feedbackRequestSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  feeling: z.string().min(1, "Feeling is required"),
  takeaway: z.string().min(10, "Takeaway must be at least 10 characters"),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  wouldRecommend: z.boolean(),
  suggestions: z.string().nullable().optional(),
  sessionId: z
    .number()
    .int()
    .min(0)
    .max(8, "Session ID must be between 0 and 8"), // 0-8 range
  sessionNumber: z.number().int().min(0).max(8).optional(), // Same as sessionId, for logging
});

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API: Feedback submission started");

    // Parse and validate the request body
    const body = await request.json();
    console.log("📋 API: Raw request body:", body);

    const validatedData = feedbackRequestSchema.parse(body);
    console.log("✅ API: Validation passed:", validatedData);

    // Extract user agent for analytics (optional)
    const userAgent = request.headers.get("user-agent") || null;

    // Prepare data for database insertion
    const insertData = {
      userId: validatedData.userId,
      feeling: validatedData.feeling,
      takeaway: validatedData.takeaway,
      rating: validatedData.rating,
      wouldRecommend: validatedData.wouldRecommend,
      suggestions: validatedData.suggestions || null,
      sessionId: validatedData.sessionId, // Store 0-based session ID
      userAgent,
      // createdAt will be set automatically by the database default
    };

    console.log("💾 API: Inserting data into database:", insertData);

    // Insert into database
    const result = await db.insert(feedback).values(insertData).returning({
      id: feedback.id,
      sessionId: feedback.sessionId,
      createdAt: feedback.createdAt,
    });

    console.log("✅ API: Database insertion successful:", result[0]);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully",
        data: {
          id: result[0].id,
          sessionId: result[0].sessionId,
          sessionNumber: validatedData.sessionId, // Same as sessionId (no conversion)
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
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Build where conditions array
    const whereConditions = [eq(feedback.userId, userId)];

    if (sessionId !== null) {
      const sessionIdNum = parseInt(sessionId);
      if (!isNaN(sessionIdNum)) {
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
      data: results.map((item) => ({
        ...item,
        sessionNumber: item.sessionId ?? 0, // Same as sessionId (no conversion)
      })),
    });
  } catch (error) {
    console.error("❌ API: Error retrieving feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}
