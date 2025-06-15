import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { OrderDetail } from "@/hooks/api/order/useGetOrderDetail";
import Link from "next/link";

interface SiteHeaderOrderDetailProps {
  orderDetail?: OrderDetail;
}

export function SiteHeaderOrderDetail({
  orderDetail,
}: SiteHeaderOrderDetailProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:gap-2">
      <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 sm:hidden" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4 sm:mx-2 sm:hidden"
        />
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="flex-wrap">
            <BreadcrumbItem>
              <Link
                href="/admin/dashboard"
                className="text-muted-foreground hover:text-primary text-sm font-medium sm:text-base"
              >
                Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link
                href="/admin/orders"
                className="text-muted-foreground hover:text-primary text-sm font-medium sm:text-base"
              >
                Orders
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="text-primary truncate text-sm font-medium sm:text-base">
                {orderDetail?.orderNumber || "Order Detail"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
