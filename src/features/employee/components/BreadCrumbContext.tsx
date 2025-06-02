"use client";

import React, { createContext, useContext, useState } from "react";

type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context)
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  return context;
};

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
