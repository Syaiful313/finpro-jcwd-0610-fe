// hooks/useDynamicBreadcrumb.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "../components/BreadCrumbContext";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

// Define allowed paths as const assertion for type safety
const ALLOWED_PATHS = [
  "/employee/orders",
  "/employee/job-history",
  "/employee/profile",
] as const;

type AllowedPath = (typeof ALLOWED_PATHS)[number];

export const useDynamicBreadcrumb = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const pathname = usePathname();

  useEffect(() => {
    const getBreadcrumbsForPath = (path: string): BreadcrumbItem[] => {
      const baseBreadcrumb = { label: "Dashboard", href: "/employee" };

      switch (path as AllowedPath) {
        case "/employee/orders":
          return [baseBreadcrumb, { label: "Orders" }];
        case "/employee/job-history":
          return [baseBreadcrumb, { label: "Job History" }];
        case "/employee/profile":
          return [baseBreadcrumb, { label: "Profile" }];
        default:
          return [baseBreadcrumb];
      }
    };

    const breadcrumbs = getBreadcrumbsForPath(pathname);
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, pathname]);
};

// Alternative dengan Record type untuk cleaner approach:
export const useDynamicBreadcrumbRecord = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const pathname = usePathname();

  useEffect(() => {
    const pathToBreadcrumb: Record<string, BreadcrumbItem[]> = {
      "/employee/orders": [
        { label: "Dashboard", href: "/employee" },
        { label: "Orders" },
      ],
      "/employee/job-history": [
        { label: "Dashboard", href: "/employee" },
        { label: "Job History" },
      ],
      "/employee/profile": [
        { label: "Dashboard", href: "/employee" },
        { label: "Profile" },
      ],
    };

    const breadcrumbs = pathToBreadcrumb[pathname] ?? [
      { label: "Dashboard", href: "/employee" },
    ];

    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, pathname]);
};

// Usage in components:
/*
// OrderPage.tsx
"use client";
import React from "react";
import { useDynamicBreadcrumb } from "../hooks/useDynamicBreadcrumb";

const OrderPage: React.FC = () => {
  useDynamicBreadcrumb();
  return <div>OrderPage</div>;
};

export default OrderPage;
*/
