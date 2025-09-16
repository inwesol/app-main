import { db } from "@/lib/db";
import { dailyJournalEntries } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function migrateJournalTable() {
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

    // Test the table by trying to query it
    const result = await db
      .select({ count: sql`count(*)` })
      .from(dailyJournalEntries)
      .limit(1);

    console.log("✅ Table is accessible and working!");
  } catch (error) {
    console.error("❌ Error creating journal table:", error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateJournalTable()
    .then(() => {
      console.log("Migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { migrateJournalTable };
