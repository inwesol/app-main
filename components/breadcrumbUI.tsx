"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbUI({ items, className = "" }: BreadcrumbProps) {
  const router = useRouter();

  const handleBreadcrumbClick = (href: string) => {
    router.push(href);
  };

  return (
    <nav aria-label="Breadcrumb" className={`mb-4 sm:mb-6 ${className}`}>
      <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
        <ol className="flex items-center space-x-1 sm:space-x-2">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center">
              {index === 0 && (
                <Home className="size-4 text-slate-500 mr-1 sm:mr-2" />
              )}

              {item.isActive ? (
                <span className="text-sm sm:text-base font-semibold text-primary-blue-700 truncate max-w-[120px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => item.href && handleBreadcrumbClick(item.href)}
                  className="text-sm sm:text-base text-slate-600 hover:text-primary-blue-700 transition-colors duration-200 font-medium truncate max-w-[100px] sm:max-w-none"
                >
                  {item.label}
                </button>
              )}

              {index < items.length - 1 && (
                <ChevronRight className="size-4 text-slate-400 mx-1 sm:mx-2 shrink-0" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
