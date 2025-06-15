"use client";

import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import useGetPendingProcessOrders from "@/hooks/api/order/useGetPendingProcessOrders";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "../../components/AppSidebar";
import { ProcessOrderForm } from "./components/ProcessOrderForm";
import {
  SiteHeaderOrderProcessDetail,
} from "./components/SiteHeaderOrderProcessDetail";

interface OrdersDetailPageProps {
  orderId: string;
}

export default function OrdersDetailPage({ orderId }: OrdersDetailPageProps) {
  const router = useRouter();

  const {
    data: pendingOrders,
    isLoading,
    error,
  } = useGetPendingProcessOrders({
    take: 10,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const orderDetail = pendingOrders?.data?.find(
    (order) => order.uuid === orderId,
  );

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeaderOrderProcessDetail orderId={orderId} />
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading order detail...</span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !orderDetail) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeaderOrderProcessDetail orderId={orderId} />
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
                onClick={() => router.push("/admin/orders")}
                className="mt-4"
              >
                Kembali ke Orders
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderOrderProcessDetail orderId={orderId} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 md:py-4">
              <div className="px-1">
                <ProcessOrderForm
                  orderId={orderId}
                  orderNumber={orderDetail.orderNumber}
                  customerName={orderDetail.customer.name}
                  customerAddress={orderDetail.customerCoordinates || null}
                  outletInfo={
                    orderDetail.outlet
                      ? {
                          latitude: orderDetail.outlet.latitude,
                          longitude: orderDetail.outlet.longitude,
                          deliveryBaseFee: orderDetail.outlet.deliveryBaseFee,
                          deliveryPerKm: orderDetail.outlet.deliveryPerKm,
                          serviceRadius: orderDetail.outlet.serviceRadius,
                        }
                      : null
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
