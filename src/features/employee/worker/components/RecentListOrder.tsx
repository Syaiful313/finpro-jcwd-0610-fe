import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  List,
  Shirt,
  Sparkles,
  Box,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import useGetStationOrder from "@/hooks/api/employee/worker/useGetStationOrder";
import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const RecentListOrder = () => {
  const router = useRouter();

  const {
    data: stationOrder,
    isPending,
    isLoading,
    isError,
    error,
  } = useGetStationOrder({
    take: 2,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const workerConfigs = {
    washing: {
      title: "Washing Station",
      icon: Shirt,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    ironing: {
      title: "Ironing Station",
      icon: Sparkles,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    packing: {
      title: "Packing Station",
      icon: Box,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
  };

  const getStepStatus = (orderWorkProcess: any[], bypassStatus?: string) => {
    const incompleteProcess = orderWorkProcess?.find(
      (process: any) => process.completedAt === null,
    );

    if (bypassStatus === "PENDING") {
      return {
        label: "Bypass Pending",
        variant: "outline",
        className: "border-orange-300 bg-orange-100 text-orange-700",
      };
    }
    if (bypassStatus === "REJECTED") {
      return {
        label: "Bypass Rejected",
        variant: "outline",
        className: "border-red-300 bg-red-100 text-red-700",
      };
    }

    if (incompleteProcess) {
      return {
        label: "In Process",
        variant: "default",
        className: "bg-blue-100 text-blue-700",
      };
    }

    return {
      label: "Completed",
      variant: "default",
      className: "bg-green-100 text-green-700",
    };
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: enUS,
    });
  };

  const getNextWorkerTypeForProcessing = (orderWorkProcess: any[]) => {
    if (!orderWorkProcess || orderWorkProcess.length === 0) {
      return "washing";
    }

    const sortedWorkProcesses = [...orderWorkProcess].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const currentIncompleteWorkProcess = sortedWorkProcesses.find(
      (p) => p.completedAt === null,
    );

    if (currentIncompleteWorkProcess) {
      return currentIncompleteWorkProcess.workerType.toLowerCase();
    }

    const lastCompletedWorkProcess = sortedWorkProcesses.find(
      (p) => p.completedAt !== null,
    );

    if (lastCompletedWorkProcess) {
      if (lastCompletedWorkProcess.workerType.toLowerCase() === "washing") {
        return "ironing";
      } else if (
        lastCompletedWorkProcess.workerType.toLowerCase() === "ironing"
      ) {
        return "packing";
      }
    }

    return "washing";
  };

  const handleContinueWork = (order: any) => {
    const nextWorkerType = getNextWorkerTypeForProcessing(
      order.orderWorkProcess,
    );
    router.push(
      `/employee/orders/process/${order.uuid}?station=${nextWorkerType}`,
    );
  };

  const recentOrders =
    stationOrder?.data?.filter((order: any) => {
      const hasIncompleteProcess = order.orderWorkProcess?.some(
        (process: any) => process.completedAt === null,
      );
      return hasIncompleteProcess;
    }) || [];

  if (isPending || isLoading) {
    return (
      <section>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
            <List className="h-5 w-5" />
            Recent Orders
          </div>
          <p className="text-muted-foreground">View your recent orders here</p>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-2 h-4 w-1/3 rounded bg-gray-200 dark:bg-[#404040]"></div>
                <div className="mb-4 h-3 w-1/2 rounded bg-gray-200 dark:bg-[#404040]"></div>
                <div className="h-10 w-full rounded bg-gray-200 dark:bg-[#404040]"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
            <List className="h-5 w-5" />
            Recent Orders
          </div>
          <p className="text-muted-foreground">View your recent orders here</p>
        </div>
        <div className="p-4 text-center text-red-500">
          Error: {error?.message || "Failed to fetch orders."}
        </div>
      </section>
    );
  }

  if (!recentOrders || recentOrders.length === 0) {
    return (
      <section>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
            <List className="h-5 w-5" />
            Recent Orders
          </div>
          <p className="text-muted-foreground">View your recent orders here</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Image
            src="/laundry-worker.svg"
            alt="No recent orders"
            width={170}
            height={170}
            className="mb-6 bg-contain opacity-70"
          />
          <h3 className="mb-2 text-lg font-semibold">No Recent Orders Yet</h3>
          <p className="mb-6 max-w-md text-gray-600">
            You haven't worked on any orders yet. Start by claiming an order to
            begin your work.
          </p>
          <Button
            onClick={() => router.push("/employee/orders")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            View Available Orders
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
          <List className="h-5 w-5" />
          Recent Orders
        </div>
        <p className="text-muted-foreground">View your recent orders here</p>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order: any) => {
          const nextWorkerType = getNextWorkerTypeForProcessing(
            order.orderWorkProcess,
          );
          const config =
            workerConfigs[nextWorkerType as keyof typeof workerConfigs];
          const IconComponent = config.icon;

          const hasBypassRequest = order.orderWorkProcess?.some(
            (process: any) => process.bypass,
          );
          const bypassStatus = order.orderWorkProcess?.find(
            (process: any) => process.bypass,
          )?.bypass?.status;

          const stepStatus = getStepStatus(
            order.orderWorkProcess,
            bypassStatus,
          );

          return (
            <Card key={order.uuid} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${config.bgColor}`}>
                      <IconComponent
                        className={`h-5 w-5 ${config.textColor}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {order.orderNumber}
                      </h3>
                      <div
                        className={`text-sm font-medium ${config.textColor}`}
                      >
                        {config.title}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={stepStatus.className}>
                      {stepStatus.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {order.user.firstName} {order.user.lastName}
                  </div>
                  {order.user.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.user.phoneNumber}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(order.updatedAt)}
                    </div>

                    {hasBypassRequest && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span className="text-orange-600">
                            Bypass Required
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => handleContinueWork(order)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Continue Work
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recentOrders.length > 0 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/employee/orders")}
            className="w-full md:w-auto"
          >
            View All Available Orders
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecentListOrder;
