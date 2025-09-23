"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbContextType {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  updateBreadcrumb: (index: number, breadcrumb: BreadcrumbItem) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  removeBreadcrumb: (index: number) => void;
  clearBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export function BreadcrumbProvider({ children }: BreadcrumbProviderProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const updateBreadcrumb = (index: number, breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs((prev) => {
      const newBreadcrumbs = [...prev];
      newBreadcrumbs[index] = breadcrumb;
      return newBreadcrumbs;
    });
  };

  const addBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    setBreadcrumbs((prev) => [...prev, breadcrumb]);
  };

  const removeBreadcrumb = (index: number) => {
    setBreadcrumbs((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbs,
        setBreadcrumbs,
        updateBreadcrumb,
        addBreadcrumb,
        removeBreadcrumb,
        clearBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider"
    );
  }
  return context;
}
