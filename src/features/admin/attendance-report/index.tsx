import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AttendanceList from "@/features/employee/attendance/components/AttendanceList";
import React from "react";
import { AppSidebar } from "../components/AppSidebar";
import { SiteHeaderAttendance } from "./components/SiteHeaderAttendance";

const AttendanceAdminPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderAttendance />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 md:pt-6">
              <div className="lg:px-6">
                <AttendanceList />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AttendanceAdminPage;
