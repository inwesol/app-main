"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { SessionFeedbackForm } from "./feedback";

function parseSessionNumber(value: string | null): number {
  if (!value) return 0; // Default to session 0

  const parsed = Number.parseInt(value, 10);

  // Ensure the session number is between 0-8
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 8) {
    console.warn(`Invalid session parameter: "${value}", defaulting to 0`);
    return 0;
  }

  return parsed;
}

function getTitleForSession(sessionNumber: number): string {
  // You can customize session titles here (0-8)
  const sessionTitles: Record<number, string> = {
    0: "Getting Started",
    1: "Foundation Building",
    2: "Personal Discovery",
    3: "Goal Setting & Planning",
    4: "Skill Development",
    5: "Progress Review",
    6: "Advanced Techniques",
    7: "Integration & Practice",
    8: "Final Assessment",
    // Add more as needed
  };

  return sessionTitles[sessionNumber] || `Session ${sessionNumber}`;
}

interface ClientSessionFeedbackProps {
  userId?: string;
  // Optional: allow overriding session from props (useful for testing)
  defaultSession?: number;
}

export default function ClientSessionFeedback({
  userId,
  defaultSession,
}: ClientSessionFeedbackProps) {
  const searchParams = useSearchParams();

  // Get session from URL params, fallback to defaultSession or 0
  const sessionParam = searchParams.get("session");
  const sessionNumber = parseSessionNumber(sessionParam) || defaultSession || 0;
  const sessionTitle = getTitleForSession(sessionNumber);

  // Debug logging (will be removed in production)
  console.log("🔍 ClientSessionFeedback Debug:", {
    searchParams: Object.fromEntries(searchParams.entries()),
    sessionParam,
    sessionNumber,
    sessionTitle,
    userId,
  });

  // Validate required props
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 flex items-center justify-center">
        <div className="bg-white border-2 border-red-200 rounded-xl p-6 text-center max-w-sm">
          <div className="text-red-500 mb-3 text-2xl">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-2">
            Missing User Information
          </h2>
          <p className="text-red-600 text-xs sm:text-sm">
            Unable to load feedback form. Please make sure you&apos;re logged in
            and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SessionFeedbackForm
      sessionNumber={sessionNumber}
      sessionTitle={sessionTitle}
      userId={userId}
      onSubmit={(feedback) => {
        console.log("✅ Feedback submitted successfully:", {
          sessionNumber: feedback.sessionNumber,
          sessionTitle: feedback.sessionTitle,
          submittedAt: feedback.submittedAt,
        });

        // Optional: Add additional client-side handling here
        // e.g., analytics tracking, notifications, etc.
      }}
    />
  );
}
