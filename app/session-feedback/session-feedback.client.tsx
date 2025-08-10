"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { SessionFeedbackForm } from './session-feedback';

function parseIntOr<T>(value: string | null, fallback: T): number | T {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getTitleForSession(sessionNumber: number) {
  return `Session ${sessionNumber}`;
}

export default function ClientSessionFeedback({ userId }: { userId?: string }) {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get('session');
  const sessionNumber = parseIntOr(sessionParam, 1) as number;
  const sessionTitle = getTitleForSession(sessionNumber);

  return (
    <SessionFeedbackForm
      sessionNumber={sessionNumber}
      sessionTitle={sessionTitle}
      userId={userId}
    />
  );
}


