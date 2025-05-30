import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "./components/EmployeeSidebar";
import { SiteHeader } from "../super/dashboard/components/SiteHeader";
import { EmployeeHeader } from "./components/EmployeeHeader";

export default function EmployeePage() {
  return (
    <SidebarProvider>
      <EmployeeSidebar role="DRIVER" variant="inset" />
      <SidebarInset>
        <EmployeeHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
