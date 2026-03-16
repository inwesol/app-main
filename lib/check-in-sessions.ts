export const CHECK_IN_SESSIONS_KEY = "checkInSessions";

export type CheckInSessionItem = {
  id: string;
  scheduledAt: string;
  scheduleStatus?: "completed";
  feedbackStatus?: "completed";
  reportStatus?: "completed";
};

export function getCheckInSessions(): CheckInSessionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHECK_IN_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCheckInSessions(sessions: CheckInSessionItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECK_IN_SESSIONS_KEY, JSON.stringify(sessions));
}
