"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useGetOrderDetail from "@/hooks/api/order/useGetOrderDetail";
import { AppSidebar } from "../components/AppSidebar";
import { ErrorMessage } from "./components/ErrorMessage";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { OrderDetailContent } from "./components/OrderDetailContent";
import { SiteHeaderOrderDetail } from "./components/SiteHeaderOrderDetail";

interface OrderDetailPageProps {
  orderId: string;
}

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const {
    data: orderDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderDetail(orderId);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return (
        <ErrorMessage
          message={error?.message || "Failed to load order detail"}
          onRetry={() => refetch()}
        />
      );
    }

    if (!orderDetail) {
      return (
        <ErrorMessage message="No order data found" onRetry={() => refetch()} />
      );
    }

    return <OrderDetailContent orderDetail={orderDetail} />;
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderOrderDetail orderDetail={orderDetail} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">{renderContent()}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
