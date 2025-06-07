"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BottomNav from "@/features/employee/components/BottomNav";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/features/employee/components/BreadCrumbContext";
import { EmployeeHeader } from "@/features/employee/components/EmployeeHeader";
import { EmployeeSidebar } from "@/features/employee/components/EmployeeSidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";

import type React from "react";
import { useEffect, useState } from "react";

interface WorkerLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathsWithoutBottomNav = [
    "/employee/order-detail",
    "/employee/profile/edit",
    // tambahkan path lain sesuai kebutuhan
  ];
  const shouldShowBottomNav = !pathsWithoutBottomNav.includes(pathname);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // PINDAHKAN BreadcrumbProvider ke level atas agar tersedia di mobile dan desktop
  return (
    <BreadcrumbProvider>
      {isMobile ? (
        // Mobile layout - sekarang sudah ada BreadcrumbProvider
        <main
          className={`min-h-screen bg-[#fafafa] ${shouldShowBottomNav ? "pb-20" : "pb-0"}`}
        >
          <div className="flex-1">
            <div className="mx-auto max-w-(--breakpoint-xl) bg-[#fafafa]">
              {children}
            </div>
          </div>
          {shouldShowBottomNav && <BottomNav />}
        </main>
      ) : (
        // Desktop layout
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
      )}
    </BreadcrumbProvider>
  );
}

function EmployeeHeaderWithBreadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  return <EmployeeHeader breadcrumbs={breadcrumbs} />;
}
