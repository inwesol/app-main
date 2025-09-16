import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  getJournalEntryByDate,
  upsertJournalEntry,
  deleteJournalEntry,
} from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entry = await getJournalEntryByDate(session.user.id, params.date);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const entry = await upsertJournalEntry(
      session.user.id,
      title || null,
      content,
      params.date
    );

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Error upserting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get the entry to find its ID
    const entry = await getJournalEntryByDate(session.user.id, params.date);

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const success = await deleteJournalEntry(entry.id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
