"use client";

import React from "react";
import { BreadcrumbUI } from "@/components/breadcrumbUI";
import { useBreadcrumbContext } from "@/contexts/BreadcrumbContext";

interface JourneyBreadcrumbLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function JourneyBreadcrumbLayout({
  children,
  className = "",
}: JourneyBreadcrumbLayoutProps) {
  const { breadcrumbs } = useBreadcrumbContext();

  return (
    <div className={className}>
      {/* Breadcrumb Navigation - Only show if breadcrumbs exist */}
      {breadcrumbs.length > 0 && <BreadcrumbUI items={breadcrumbs} />}
      {children}
    </div>
  );
}
