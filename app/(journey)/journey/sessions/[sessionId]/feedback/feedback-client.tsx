"use client";
import React, { useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { SessionFeedbackForm } from "./feedback";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { JourneyBreadcrumbLayout } from "@/components/layouts/JourneyBreadcrumbLayout";
import { SESSION_TEMPLATES } from "@/lib/constants";

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
  // Get session title from SESSION_TEMPLATES
  const sessionTemplate = SESSION_TEMPLATES.find(
    (template) => template.id === sessionNumber
  );
  return sessionTemplate?.title || `Session ${sessionNumber}`;
}

interface ClientSessionFeedbackProps {
  userId?: string;
  // Optional: allow overriding session from props (useful for testing)
  defaultSessionId?: number;
}

export default function ClientSessionFeedback({
  userId,
  defaultSessionId,
}: ClientSessionFeedbackProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const { setJourneyBreadcrumbs } = useBreadcrumb();

  // Get session from URL params, fallback to defaultSessionId or 0
  const sessionParam = params.sessionId as string;
  const sessionId = parseSessionNumber(sessionParam) || defaultSessionId || 0;
  const sessionTitle = getTitleForSession(sessionId);

  // Set up breadcrumbs
  useEffect(() => {
    const sessionId = params.sessionId as string;
    setJourneyBreadcrumbs(sessionId, "Feedback");
  }, [params.sessionId, setJourneyBreadcrumbs]);

  // Debug logging (will be removed in production)
  console.log("🔍 ClientSessionFeedback Debug:", {
    urlParams: params,
    sessionParam,
    sessionId,
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
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <JourneyBreadcrumbLayout>
          <SessionFeedbackForm
            sessionId={sessionId}
            sessionTitle={sessionTitle}
            userId={userId}
            onSubmit={(feedback) => {
              console.log("✅ Feedback submitted successfully:", {
                sessionId: feedback.sessionId,
                sessionTitle: feedback.sessionTitle,
                submittedAt: feedback.submittedAt,
              });

              // Optional: Add additional client-side handling here
              // e.g., analytics tracking, notifications, etc.
            }}
          />
        </JourneyBreadcrumbLayout>
      </div>
    </div>
  );
}
