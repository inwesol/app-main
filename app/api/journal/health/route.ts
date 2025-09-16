import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyJournalEntries } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Try to query the table to see if it exists
    const result = await db
      .select({ count: sql`count(*)` })
      .from(dailyJournalEntries)
      .limit(1);

    return NextResponse.json({
      status: "healthy",
      tableExists: true,
      message: "Journal table is accessible",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        tableExists: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Journal table may not exist or there's a connection issue",
      },
      { status: 500 }
    );
  }
}
