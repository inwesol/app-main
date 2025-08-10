// route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  completeUserSessionFormProgress,
  getUserByEmail,
  updateJourneyProgressAfterForm,
} from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
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
