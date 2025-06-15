"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  Clock,
  Droplets,
  Info,
  Package,
  Shirt,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  updatedBy?: {
    name: string;
    role: string;
  };
  notes?: string;
}

export function OrderTimeline({
  statusHistory,
  currentStatus,
}: {
  statusHistory: StatusHistoryItem[];
  currentStatus: string;
}) {
  const sortedHistory = [...statusHistory].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const allStatuses = [
    { key: "WAITING_FOR_PICKUP", icon: Clock, label: "Pesanan Dibuat" },
    {
      key: "DRIVER_ON_THE_WAY_TO_CUSTOMER",
      icon: Truck,
      label: "Sedang Dijemput",
    },
    {
      key: "ARRIVED_AT_CUSTOMER",
      icon: ShoppingBag,
      label: "Tiba di Pelanggan",
    },
    {
      key: "DRIVER_ON_THE_WAY_TO_OUTLET",
      icon: Truck,
      label: "Menuju Outlet",
    },
    { key: "ARRIVED_AT_OUTLET", icon: Package, label: "Tiba di Outlet" },
    { key: "BEING_WASHED", icon: Droplets, label: "Sedang Dicuci" },
    { key: "BEING_IRONED", icon: Shirt, label: "Sedang Disetrika" },
    { key: "BEING_PACKED", icon: Package, label: "Sedang Dikemas" },
    { key: "READY_FOR_DELIVERY", icon: Package, label: "Siap Dikirim" },
    {
      key: "BEING_DELIVERED_TO_CUSTOMER",
      icon: Truck,
      label: "Sedang Dikirim",
    },
    { key: "DELIVERED_TO_CUSTOMER", icon: CheckCircle2, label: "Terkirim" },
    { key: "COMPLETED", icon: CheckCircle2, label: "Selesai" },
  ];

  const currentStatusIndex = allStatuses.findIndex(
    (status) => status.key === currentStatus,
  );

  const getStepStatus = (statusKey: string) => {
    const stepIndex = allStatuses.findIndex(
      (status) => status.key === statusKey,
    );
    const historyItem = sortedHistory.find((item) => item.status === statusKey);

    if (historyItem) {
      return "completed";
    } else if (stepIndex < currentStatusIndex) {
      return "skipped";
    } else if (statusKey === currentStatus) {
      return "current";
    } else {
      return "pending";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHistoryItem = (statusKey: string) => {
    return sortedHistory.find((item) => item.status === statusKey);
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Timeline (Horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connector Line */}
          <div className="bg-muted absolute top-5 left-0 h-0.5 w-full"></div>

          {/* Timeline Steps */}
          <div className="relative flex justify-between">
            {allStatuses.map((status, index) => {
              const stepStatus = getStepStatus(status.key);
              const historyItem = getHistoryItem(status.key);
              const IconComponent = status.icon;

              return (
                <TooltipProvider key={status.key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex w-20 flex-col items-center">
                        {/* Status Icon */}
                        <div
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                            stepStatus === "completed"
                              ? "border-green-500 bg-green-50 text-green-500"
                              : stepStatus === "current"
                                ? "border-blue-500 bg-blue-50 text-blue-500"
                                : stepStatus === "skipped"
                                  ? "border-orange-500 bg-orange-50 text-orange-500"
                                  : "border-gray-200 bg-gray-50 text-gray-400"
                          } `}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="mt-2 text-center text-xs font-medium">
                          {status.label}
                        </div>

                        {historyItem && (
                          <div className="text-muted-foreground mt-1 text-center text-xs">
                            {formatDate(historyItem.timestamp)}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>

                    <TooltipContent
                      side="bottom"
                      align="center"
                      className="max-w-xs p-4"
                    >
                      <div className="space-y-2">
                        <div className="font-medium">{status.label}</div>
                        {historyItem ? (
                          <>
                            <div className="text-muted-foreground text-sm">
                              {new Date(historyItem.timestamp).toLocaleString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                            {historyItem.updatedBy && (
                              <div className="flex items-center text-xs">
                                <User className="mr-1 h-3 w-3" />
                                <span>
                                  {historyItem.updatedBy.name} (
                                  {historyItem.updatedBy.role})
                                </span>
                              </div>
                            )}
                            {historyItem.notes && (
                              <div className="bg-muted flex items-start gap-1 rounded-md p-2 text-xs">
                                <Info className="h-3 w-3 shrink-0 translate-y-0.5" />
                                <span>{historyItem.notes}</span>
                              </div>
                            )}
                          </>
                        ) : stepStatus === "current" ? (
                          <div className="text-muted-foreground text-sm">
                            Status saat ini
                          </div>
                        ) : stepStatus === "skipped" ? (
                          <div className="text-sm text-orange-500">
                            Tahap ini dilewati
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">
                            Menunggu
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative space-y-0">
          <div className="bg-muted absolute top-0 left-5 h-full w-0.5"></div>

          {allStatuses.map((status, index) => {
            const stepStatus = getStepStatus(status.key);
            const historyItem = getHistoryItem(status.key);
            const IconComponent = status.icon;

            return (
              <div key={status.key} className="relative flex gap-4 pb-8 pl-14">
                <div
                  className={`absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border ${
                    stepStatus === "completed"
                      ? "border-green-500 bg-green-50 text-green-500"
                      : stepStatus === "current"
                        ? "border-blue-500 bg-blue-50 text-blue-500"
                        : stepStatus === "skipped"
                          ? "border-orange-500 bg-orange-50 text-orange-500"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                  } `}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="font-medium">{status.label}</div>

                  {historyItem ? (
                    <>
                      <div className="text-muted-foreground text-sm">
                        {new Date(historyItem.timestamp).toLocaleString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </div>
                      {historyItem.updatedBy && (
                        <div className="mt-1 flex items-center text-xs">
                          <User className="mr-1 h-3 w-3" />
                          <span>
                            {historyItem.updatedBy.name} (
                            {historyItem.updatedBy.role})
                          </span>
                        </div>
                      )}
                      {historyItem.notes && (
                        <div className="bg-muted mt-2 rounded-md p-2 text-xs">
                          <p className="flex items-start gap-1">
                            <Info className="h-3 w-3 shrink-0 translate-y-0.5" />
                            <span>{historyItem.notes}</span>
                          </p>
                        </div>
                      )}
                    </>
                  ) : stepStatus === "current" ? (
                    <div className="text-sm text-blue-500">Status saat ini</div>
                  ) : stepStatus === "skipped" ? (
                    <div className="text-sm text-orange-500">
                      Tahap ini dilewati
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Menunggu
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
