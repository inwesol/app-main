"use client";

import { useCallback } from "react";
import { useBreadcrumbContext } from "@/contexts/BreadcrumbContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export function useBreadcrumb() {
  const context = useBreadcrumbContext();

  const setJourneyBreadcrumbs = useCallback(
    (sessionId: string, currentPage?: string) => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: "Home", href: "/" },
        { label: "Career Journey", href: "/journey" },
        {
          label: `Session ${Number(sessionId) + 1}`,
          href: `/journey/sessions/${sessionId}`,
        },
      ];

      if (currentPage) {
        breadcrumbs.push({ label: currentPage, isActive: true });
      }

      context.setBreadcrumbs(breadcrumbs);
    },
    [context.setBreadcrumbs]
  );

  const setQuestionnaireBreadcrumbs = useCallback(
    (sessionId: string, questionnaireName: string) => {
      setJourneyBreadcrumbs(sessionId, questionnaireName);
    },
    [setJourneyBreadcrumbs]
  );

  const setSessionBreadcrumbs = useCallback(
    (sessionId: string) => {
      setJourneyBreadcrumbs(sessionId);
    },
    [setJourneyBreadcrumbs]
  );

  return {
    ...context,
    setJourneyBreadcrumbs,
    setQuestionnaireBreadcrumbs,
    setSessionBreadcrumbs,
  };
}
