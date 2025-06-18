"use client";

import PaginationSection from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useGetStationOrder from "@/hooks/api/employee/worker/useGetStationOrder";
import formatRupiah from "@/utils/RupiahFormat";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, MapPin, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import StationOrderFilters from "./OrderStationFilter";
import { getOrderStatusConfig } from "@/utils/StationOrder";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const TryStation = () => {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [queryDateFrom, setQueryDateFrom] = useQueryState(
    "dateFrom",
    parseAsIsoDateTime,
  );
  const [queryDateTo, setQueryDateTo] = useQueryState(
    "dateTo",
    parseAsIsoDateTime,
  );
  const [queryWorkerType, setQueryWorkerType] = useQueryState(
    "workerType",
    parseAsString.withDefault("all"),
  );

  const itemsPerPage = 4;

  const {
    data: stationOrder,
    isPending,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetStationOrder({
    take: itemsPerPage,
    page: page,
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: queryDateFrom ? format(queryDateFrom, "yyyy-MM-dd") : "",
    dateTo: queryDateTo ? format(queryDateTo, "yyyy-MM-dd") : "",
    workerType:
      queryWorkerType === "all"
        ? undefined
        : (queryWorkerType as "washing" | "ironing" | "packing"),
  });

  const hasNext = stationOrder?.meta?.hasNext || false;
  const hasPrevious = stationOrder?.meta?.hasPrevious || false;
  const totalHistory = stationOrder?.meta?.total || 0;

  const handleApplyFilters = ({
    dateFrom,
    dateTo,
    workerType,
  }: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    workerType: string;
  }) => {
    setQueryDateFrom(dateFrom === undefined ? null : dateFrom);
    setQueryDateTo(dateTo === undefined ? null : dateTo);
    setQueryWorkerType(workerType);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPage(1);
  };

  return (
    <div>
      {" "}
      <div className="space-y-6 p-3 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Package className="h-6 w-6" />
              Station Order Queue
            </CardTitle>
            <CardDescription>
              View and filter completed order history
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <StationOrderFilters
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </div>
      {isPending ? (
        <div className="p-4 text-center">Loading orders...</div>
      ) : isError ? (
        <div className="p-4 text-center text-red-500">
          Error: {error?.message || "Failed to fetch orders."}
        </div>
      ) : (
        <div className="p-3 md:p-6">
          {stationOrder?.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stationOrder.data.map((order) => {
                const statusConfig = getOrderStatusConfig(order.orderStatus);
                let nextWorkerTypeForProcessing:
                  | "washing"
                  | "ironing"
                  | "packing"
                  | undefined;

                const sortedWorkProcesses = [
                  ...(order.orderWorkProcess || []),
                ].sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                );

                const lastCompletedWorkProcess = sortedWorkProcesses.find(
                  (p) => p.completedAt !== null,
                );
                const currentIncompleteWorkProcess = sortedWorkProcesses.find(
                  (p) => p.completedAt === null,
                );

                if (currentIncompleteWorkProcess) {
                  nextWorkerTypeForProcessing =
                    currentIncompleteWorkProcess.workerType.toLowerCase() as
                      | "washing"
                      | "ironing"
                      | "packing";
                } else if (lastCompletedWorkProcess) {
                  if (
                    lastCompletedWorkProcess.workerType.toLowerCase() ===
                    "washing"
                  ) {
                    nextWorkerTypeForProcessing = "ironing";
                  } else if (
                    lastCompletedWorkProcess.workerType.toLowerCase() ===
                    "ironing"
                  ) {
                    nextWorkerTypeForProcessing = "packing";
                  }
                } else {
                  if (order.orderStatus === "ARRIVED_AT_OUTLET") {
                    nextWorkerTypeForProcessing = "washing";
                  }
                }

                return (
                  <Card
                    key={order.uuid}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          <span className="md:hidden">Order Number :</span>{" "}
                          {order.orderNumber}
                        </CardTitle>
                        <Badge
                          variant={statusConfig.variant}
                          className={`text-xs ${statusConfig.className || ""}`}
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {order.user.firstName} {order.user.lastName}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Total Price:
                        </span>
                        <span className="text-sm font-semibold">
                          {formatRupiah(order.totalPrice || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {order.outlet.outletName}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500">
                        Order Date:{" "}
                        {format(new Date(order.createdAt), "PPP, p", {
                          locale: id,
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          if (nextWorkerTypeForProcessing) {
                            router.push(
                              `/employee/orders/process/${order.uuid}?station=${nextWorkerTypeForProcessing}`,
                            );
                          } else {
                            toast.info(
                              "This order is not currently awaiting a worker station process or has completed all worker stages.",
                            );
                            router.push(
                              `/employee/orders/detail/${order.uuid}`,
                            );
                          }
                        }}
                        disabled={!nextWorkerTypeForProcessing}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center">
              No completed orders found for the selected filters.
            </div>
          )}
          <div className="mt-6">
            <PaginationSection
              page={page}
              take={itemsPerPage}
              total={stationOrder?.meta?.total || 0}
              onChangePage={setPage}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TryStation;
