import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { SiteHeaderEmployeePerformance } from "./components/SiteHeaderEmployeePerformance";
import { EmployeePerformanceTable } from "./components/EmployeePerformanceTable";

export default function EmployeePerformancePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderEmployeePerformance />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 md:pt-6">
              <div className="lg:px-6">
             <EmployeePerformanceTable/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
