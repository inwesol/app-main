// route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  completeUserSessionFormProgress,
  getUserByEmail,
  updateJourneyProgressAfterForm,
} from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { report } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { sessionId } = await params;
    const qId = "session-report";
    // Optionally fetch the full user record using your function (including name etc.)
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body for report data (does NOT include email)
    const reportData = await req.json();

    if (!reportData.sessionName || !reportData.sessionId || !reportData.forms) {
      return NextResponse.json(
        { error: "Missing required report data" },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Compose email HTML body (customize as needed)
    const htmlBody = `
      <h1>Session Report: ${reportData.sessionName}</h1>
      <h2>Session Number: ${reportData.sessionId}</h2>
      <p>Date Completed at: ${reportData.dateCompleted}</>
      <h2>Completed Forms:</h2>
      <ul>
        ${reportData.forms
          .map((form: any) => `<li><strong>${form.title}</strong>`)
          .join("")}
      </ul>
      <h2>Scheduler Summary:</h2>
      <p>${reportData.schedulerSummary}</p>
      <p>Additional Notes: ${reportData.additionalNotes ?? "None"}</p>
    `;

    // Create summary text for the report
    const summary = `
Session: ${reportData.sessionName}
Date Completed: ${reportData.dateCompleted}
Completed Forms: ${reportData.forms.map((form: any) => form.title).join(", ")}
Scheduler Summary: ${reportData.schedulerSummary}
Additional Notes: ${reportData.additionalNotes ?? "None"}
    `.trim();

    // Check if report already exists for this user and session
    const existingReport = await db
      .select()
      .from(report)
      .where(
        and(
          eq(report.user_id, session.user.id),
          eq(report.session_id, Number(sessionId))
        )
      )
      .limit(1);

    if (existingReport.length > 0) {
      // Update existing report
      await db
        .update(report)
        .set({
          summary,
          updated_at: new Date(),
        })
        .where(eq(report.id, existingReport[0].id));
    } else {
      // Create new report
      await db.insert(report).values({
        user_id: session.user.id,
        session_id: Number(sessionId),
        summary,
      });
    }

    // Send the email to the authenticated user's email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Your Session Report: ${reportData.sessionName}`,
      html: htmlBody,
    });
    await completeUserSessionFormProgress({
      userId: session.user.id,
      sessionId: Number(sessionId),
      qId,
    });
    await updateJourneyProgressAfterForm(session.user.id, Number(sessionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send report email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;

    // Get the report for this user and session
    const reportData = await db
      .select()
      .from(report)
      .where(
        and(
          eq(report.user_id, session.user.id),
          eq(report.session_id, Number(sessionId))
        )
      )
      .limit(1);

    if (reportData.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report: reportData[0],
    });
  } catch (error) {
    console.error("Failed to fetch report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
