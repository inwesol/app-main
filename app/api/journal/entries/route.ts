import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  upsertJournalEntry,
  getJournalEntries,
  searchJournalEntries,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    let entries: any[];
    if (search) {
      entries = await searchJournalEntries(session.user.id, search, limit);
    } else {
      entries = await getJournalEntries(session.user.id, limit, offset);
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let session: any = null;
  let title: string | null = null;
  let content: string | null = null;
  let entryDate: string | null = null;

  try {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    title = body.title;
    content = body.content;
    entryDate = body.entryDate;

    if (!content || !entryDate) {
      return NextResponse.json(
        { error: "Content and entryDate are required" },
        { status: 400 }
      );
    }

    const entry = await upsertJournalEntry(
      session.user.id,
      title || null,
      content,
      entryDate
    );

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      userId: session?.user?.id,
      title: title || "N/A",
      content: content?.substring(0, 100) || "N/A",
      entryDate: entryDate || "N/A",
    });
    return NextResponse.json(
      {
        error: "Failed to create journal entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
