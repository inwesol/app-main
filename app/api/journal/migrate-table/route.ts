import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    console.log("Creating daily_journal_entries table...");

    // Create the table using raw SQL
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS daily_journal_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        title TEXT,
        content TEXT NOT NULL,
        word_count INTEGER NOT NULL DEFAULT 0,
        entry_date VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        CONSTRAINT daily_journal_user_date_unique UNIQUE (user_id, entry_date)
      )
    `);

    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_daily_journal_user_id ON daily_journal_entries(user_id)
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_daily_journal_entry_date ON daily_journal_entries(entry_date)
    `);

    console.log("✅ daily_journal_entries table created successfully!");

    return NextResponse.json({
      success: true,
      message: "daily_journal_entries table created successfully!",
    });
  } catch (error) {
    console.error("❌ Error creating journal table:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to create journal table",
      },
      { status: 500 }
    );
  }
}
