// components/pages/JobHistoryDetail.tsx

"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetHistoryDetail from "@/hooks/api/employee/worker/useGetHistoryDetail";
import { formatDate } from "@/utils/formatDate";
import { getOrderStatusConfig } from "@/utils/StationOrder";
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  FileText,
  PackageCheck,
  Shirt,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Helper kecil untuk menampilkan ikon berdasarkan workerType
const StationIcon = ({ type }: { type: string }) => {
  if (type === "WASHING") return <Shirt className="mr-2 h-5 w-5" />;
  if (type === "IRONING") return <Sparkles className="mr-2 h-5 w-5" />;
  if (type === "PACKING") return <Box className="mr-2 h-5 w-5" />;
  return <PackageCheck className="mr-2 h-5 w-5" />;
};

export default function DetailWorkerHistory({ uuid }: { uuid: string }) {
  const router = useRouter();

  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useGetHistoryDetail(uuid);

  if (isLoading) {
    return <div className="p-6 text-center">Loading history detail...</div>;
  }

  if (isError || !orderData) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error?.message || "Failed to load order detail."}
      </div>
    );
  }

  const statusConfig = getOrderStatusConfig(orderData.orderStatus);

  return (
    <div className="min-h-screen w-full space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order {orderData.orderNumber}
              </CardTitle>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>
                  {orderData.user.firstName} {orderData.user.lastName}
                </span>
                <Badge
                  variant={statusConfig.variant}
                  className={statusConfig.className}
                >
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Process Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderData.orderWorkProcess.map((process) => (
            <div
              key={process.id}
              className="rounded-lg border bg-gray-50/50 p-4"
            >
              <div className="flex items-center justify-between font-semibold">
                <div className="flex items-center">
                  <StationIcon type={process.workerType} />
                  <span>Station: {process.workerType}</span>
                </div>
                <span className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />{" "}
                  {process.employee.user.firstName}{" "}
                  {process.employee.user.lastName}
                </span>
              </div>
              <div className="mt-2 border-t pt-2 text-sm text-gray-600">
                <p>
                  <strong>Started at:</strong>{" "}
                  {process.createdAt
                    ? formatDate(process.createdAt)
                    : "In Progress"}
                </p>
                <p>
                  <strong>Completed at:</strong>{" "}
                  {process.completedAt
                    ? formatDate(process.completedAt)
                    : "In Progress"}
                </p>
                {process.notes && (
                  <p>
                    <strong>Notes:</strong> {process.notes}
                  </p>
                )}
              </div>

              {process.bypass && (
                <Alert variant="destructive" className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Process Completed via Bypass
                  </AlertTitle>
                  <AlertDescription>
                    <strong>Reason:</strong> {process.bypass.reason} <br />
                    {process.bypass.adminNote && (
                      <span>
                        <strong>Admin Note:</strong> {process.bypass.adminNote}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {orderData.orderItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between rounded-md bg-gray-50 p-2"
              >
                <span>
                  {item.laundryItem.name} x {item.quantity}
                </span>
                <span className="font-mono">
                  Rp{item.totalPrice.toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
          {/* <div className="mt-4 font-semibold">
            <p>Total Weight:</p>{" "}
            {orderData.totalWeight ? (
              <p className="font-mono">
                {orderData.totalWeight.toLocaleString("id-ID")} kg
              </p>
            ) : (
              <span className="text-red-500">Weight not available</span>
            )}
            <span>Total Price:</span>
            {orderData.totalPrice ? (
              <span className="font-mono">
                Rp {orderData.totalPrice.toLocaleString("id-ID")}
              </span>
            ) : (
              <span className="text-red-500">Price not available</span>
            )}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
