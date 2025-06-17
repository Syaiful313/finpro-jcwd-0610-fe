import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { HeaderWithFilterSalesReports } from "./components/HeaderWithFilterSalesReports";
import { SalesReportsMainContent } from "./components/SalesReportsMainContent";
import { SiteHeaderSalesReports } from "./components/SiteHeaderSalesReports";

export default function SalesReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderSalesReports />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 md:pt-6">
              <div className="lg:px-6">
                <HeaderWithFilterSalesReports />
                <SalesReportsMainContent />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
