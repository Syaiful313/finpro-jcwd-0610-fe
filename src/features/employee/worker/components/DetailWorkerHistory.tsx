"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useGetHistoryDetail from "@/hooks/api/employee/worker/useGetHistoryDetail";
import { formatDate } from "@/utils/formatDate";
import { getOrderStatusConfig } from "@/utils/StationOrder";
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  Calendar,
  Clock,
  FileText,
  PackageCheck,
  Phone,
  Shirt,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

const StationIcon = ({ type }: { type: string }) => {
  if (type === "WASHING") return <Shirt className="h-5 w-5 text-blue-600" />;
  if (type === "IRONING")
    return <Sparkles className="h-5 w-5 text-purple-600" />;
  if (type === "PACKING") return <Box className="h-5 w-5 text-green-600" />;
  return <PackageCheck className="h-5 w-5 text-orange-600" />;
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading history detail...</p>
        </div>
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="text-destructive mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">Error Loading Data</h3>
            <p className="text-muted-foreground">
              {error?.message || "Failed to load order detail."}
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getOrderStatusConfig(orderData.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container max-w-6xl space-y-4 p-4 md:space-y-6 md:p-6">
        {/* Header Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {orderData.orderNumber}
                  </CardTitle>
                  <Badge
                    variant={statusConfig.variant}
                    className={`${statusConfig.className} px-3 py-1`}
                  >
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {orderData.user.firstName} {orderData.user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">
                      {orderData.user.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full shrink-0 sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Work Process Timeline */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Work Process Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 px-3 md:px-6">
                {orderData.orderWorkProcess.map((process, index) => (
                  <div
                    key={process.id}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm">
                        <StationIcon type={process.workerType} />
                      </div>
                      {index < orderData.orderWorkProcess.length - 1 && (
                        <div className="absolute top-12 left-1/2 h-full w-0.5 -translate-x-1/2 transform bg-gray-300"></div>
                      )}
                    </div>

                    <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm">
                      <div className="mb-3 flex flex-col gap-1">
                        <h4 className="font-semibold text-gray-900">
                          {process.workerType} Station
                        </h4>
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <UserCheck className="h-4 w-4" />
                          <span>
                            {process.employee.user.firstName}{" "}
                            {process.employee.user.lastName}
                          </span>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3 text-sm">
                          <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
                          <div>
                            <span className="font-medium">Started:</span>
                            <p className="text-muted-foreground">
                              {process.createdAt
                                ? formatDate(process.createdAt)
                                : "In Progress"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                          <div>
                            <span className="font-medium">Completed:</span>
                            <p className="text-muted-foreground">
                              {process.completedAt
                                ? formatDate(process.completedAt)
                                : "In Progress"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {process.notes && (
                        <div className="mt-3 rounded-md bg-gray-50 p-3">
                          <p className="text-sm">
                            <span className="font-medium">Notes:</span>{" "}
                            {process.notes}
                          </p>
                        </div>
                      )}

                      {process.bypass && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle className="font-bold">
                            Process Completed via Bypass
                          </AlertTitle>
                          <AlertDescription className="mt-2">
                            <div className="space-y-1">
                              <p>
                                <strong>Reason:</strong> {process.bypass.reason}
                              </p>
                              {process.bypass.adminNote && (
                                <p>
                                  <strong>Admin Note:</strong>{" "}
                                  {process.bypass.adminNote}
                                </p>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div className="space-y-4 lg:space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderData.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.laundryItem.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold">
                          Rp{item.totalPrice.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
