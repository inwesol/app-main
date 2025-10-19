import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { upsertJournalEntry } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entries } = await request.json();

    if (!Array.isArray(entries)) {
      return NextResponse.json(
        { error: "Entries must be an array" },
        { status: 400 }
      );
    }

    const migratedEntries = [];

    for (const entry of entries) {
      try {
        // Convert old format to new format
        const migratedEntry = await upsertJournalEntry(
          session.user.id,
          entry.title || null,
          entry.content,
          entry.date.split("T")[0] // Convert ISO date to YYYY-MM-DD
        );
        migratedEntries.push(migratedEntry);
      } catch (error) {
        console.error("Error migrating entry:", error);
        // Continue with other entries even if one fails
      }
    }

    return NextResponse.json({
      message: `Successfully migrated ${migratedEntries.length} entries`,
      entries: migratedEntries,
    });
  } catch (error) {
    console.error("Error migrating journal entries:", error);
    return NextResponse.json(
      { error: "Failed to migrate journal entries" },
      { status: 500 }
    );
  }
}
