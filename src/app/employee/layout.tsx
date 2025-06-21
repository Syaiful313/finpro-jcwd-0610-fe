"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BottomNav from "@/features/employee/components/BottomNav";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/features/employee/components/BreadCrumbContext";
import { EmployeeHeader } from "@/features/employee/components/EmployeeHeader";
import { EmployeeSidebar } from "@/features/employee/components/EmployeeSidebar";
import { usePathname } from "next/navigation";
import type React from "react";

interface WorkerLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();

  const shouldHideBottomNav = (currentPath: string): boolean => {
    const pathsWithoutBottomNav = [
      "/employee/orders/order-detail",
      "/employee/orders/process",
    ];

    const pathPatternsWithoutBottomNav = [
      /^\/employee\/orders\/order-detail\/[^\/]+$/,
      /^\/employee\/orders\/order-detail\/[^\/]+\/.*$/,
    ];

    if (pathsWithoutBottomNav.includes(currentPath)) {
      return true;
    }

    return pathPatternsWithoutBottomNav.some((pattern) =>
      pattern.test(currentPath),
    );
  };

  const shouldShowBottomNav = !shouldHideBottomNav(pathname);

  return (
    <BreadcrumbProvider>
      {/* desktop */}
      <div className="hidden md:block">
        <SidebarProvider>
          <EmployeeSidebar role="WORKER" variant="inset" />
          <SidebarInset>
            <EmployeeHeaderWithBreadcrumb />
            <main>
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  {children}
                </div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* mobile */}
      <div className="block md:hidden">
        <main
          className={`min-h-screen bg-[#fafafa] ${
            shouldShowBottomNav ? "pb-20" : "pb-0"
          }`}
        >
          <div className="flex-1">
            <div className="mx-auto max-w-(--breakpoint-xl) bg-[#fafafa]">
              {children}
            </div>
          </div>
          {shouldShowBottomNav && <BottomNav />}
        </main>
      </div>
    </BreadcrumbProvider>
  );
}

function EmployeeHeaderWithBreadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  return <EmployeeHeader breadcrumbs={breadcrumbs} />;
}
