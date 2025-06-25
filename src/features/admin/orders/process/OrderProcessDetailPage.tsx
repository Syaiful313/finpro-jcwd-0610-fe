"use client";

import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useGetPendingProcessOrders from "@/hooks/api/order/useGetPendingProcessOrders";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AppSidebar } from "../../components/AppSidebar";
import { ProcessOrderForm } from "./components/ProcessOrderForm";
import { SiteHeaderOrderProcessDetail } from "./components/SiteHeaderOrderProcessDetail";

interface OrdersDetailPageProps {
  orderId: string;
}

export default function OrdersProcessDetailPage({
  orderId,
}: OrdersDetailPageProps) {
  const router = useRouter();

  const {
    data: pendingOrders,
    isLoading,
    error,
  } = useGetPendingProcessOrders();

  const orderDetail = useMemo(() => {
    return pendingOrders?.data?.find((order) => order.uuid === orderId);
  }, [pendingOrders?.data, orderId]);

  const outletInfo = useMemo(() => {
    if (!orderDetail?.outlet) return null;

    return {
      latitude: orderDetail.outlet.latitude,
      longitude: orderDetail.outlet.longitude,
      deliveryBaseFee: orderDetail.outlet.deliveryBaseFee,
      deliveryPerKm: orderDetail.outlet.deliveryPerKm,
      serviceRadius: orderDetail.outlet.serviceRadius,
    };
  }, [orderDetail?.outlet]);

  const handleBackToOrders = () => router.push("/admin/orders");

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderOrderProcessDetail orderId={orderId} />

        <div className="flex flex-1 flex-col">
          {isLoading && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading order detail...</span>
            </div>
          )}

          {(error || !orderDetail) && !isLoading && (
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <p className="text-lg font-medium text-red-600">
                  Order tidak ditemukan
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Order mungkin sudah diproses atau tidak valid.
                </p>
                <Button
                  variant="outline"
                  onClick={handleBackToOrders}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Orders
                </Button>
              </div>
            </div>
          )}

          {orderDetail && !isLoading && (
            <div className="flex flex-1 flex-col p-4">
              <ProcessOrderForm
                orderId={orderId}
                orderNumber={orderDetail.orderNumber}
                customerName={orderDetail.customer.name}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
