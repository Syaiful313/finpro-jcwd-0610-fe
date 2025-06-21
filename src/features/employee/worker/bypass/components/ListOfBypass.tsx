"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetListOfBypass from "@/hooks/api/employee/worker/useGetListOfBypass";
import { getBypassStatusConfig } from "@/utils/StationOrder";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronsRight, FileText, Info, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import BypassFilter from "./BypassFilter";
import { useState } from "react";
import Loader from "@/features/employee/components/Loader";
import Image from "next/image";

const ListOfBypass = () => {
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
  const [queryStatus, setQueryStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [includeCompleted, setIncludeCompleted] = useState(false);

  const itemsPerPage = 6;

  const {
    data: bypassData,
    isPending,
    isError,
    error,
  } = useGetListOfBypass({
    take: itemsPerPage,
    page: page,
    sortBy: "createdAt",
    sortOrder: "desc",
    dateFrom: queryDateFrom ? format(queryDateFrom, "yyyy-MM-dd") : undefined,
    dateTo: queryDateTo ? format(queryDateTo, "yyyy-MM-dd") : undefined,
    status:
      queryStatus === "all"
        ? undefined
        : (queryStatus as "pending" | "approved" | "rejected"),
    includeCompleted: true,
  });

  const hasNext = bypassData?.meta?.hasNext || false;
  const hasPrevious = bypassData?.meta?.hasPrevious || false;
  const totalOrder = bypassData?.meta?.total || 0;
  const currentResults = bypassData?.data?.length || 0;
  const totalPages = Math.ceil(totalOrder / itemsPerPage);

  const handleApplyFilters = ({
    dateFrom,
    dateTo,
    status,
  }: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    status: string;
  }) => {
    setQueryDateFrom(dateFrom === undefined ? null : dateFrom);
    setQueryDateTo(dateTo === undefined ? null : dateTo);
    setQueryStatus(status);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPage(1);
  };

  return (
    <div>
      <div className="space-y-6 p-3 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FileText className="h-6 w-6" />
              Bypass Request List
            </CardTitle>
            <CardDescription>
              View and manage bypass requests from workers
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <BypassFilter
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isPending={isPending}
            />
          </CardContent>

          {/* card */}
          <div className="space-y-4">
            {isPending ? (
              <div>
                <Loader />
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-red-500">
                Error: {error?.message || "Failed to fetch data."}
              </div>
            ) : (
              <div className="p-3 md:p-6">
                {!isPending && !isError && (
                  <div className="flex items-center justify-between pb-4">
                    <p className="text-muted-foreground text-sm">
                      Showing {currentResults} of {totalOrder} bypass request
                      records
                    </p>
                    {totalPages > 0 && (
                      <p className="text-muted-foreground text-sm">
                        Page {page} of {totalPages}
                      </p>
                    )}
                  </div>
                )}
                {bypassData?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bypassData.data.map((request) => {
                      const statusConfig = getBypassStatusConfig(
                        request.bypassStatus,
                      );
                      const workProcess = request.orderWorkProcesses?.[0];
                      const associatedOrder = workProcess?.order;

                      if (!associatedOrder || !workProcess) return null;

                      let nextStation:
                        | "washing"
                        | "ironing"
                        | "packing"
                        | undefined;
                      const bypassedStation =
                        workProcess.workerType.toLowerCase();
                      if (bypassedStation === "washing") {
                        nextStation = "washing";
                      } else if (bypassedStation === "ironing") {
                        nextStation = "ironing";
                      } else if (bypassedStation === "packing") {
                        nextStation = "packing";
                      }

                      let isActionable = false;
                      if (bypassedStation === "washing") {
                        isActionable =
                          associatedOrder.orderStatus === "ARRIVED_AT_OUTLET";
                      } else if (bypassedStation === "ironing") {
                        isActionable =
                          associatedOrder.orderStatus === "BEING_WASHED";
                      } else if (bypassedStation === "packing") {
                        isActionable =
                          associatedOrder.orderStatus === "BEING_IRONED";
                      }

                      const isButtonDisabled =
                        request.bypassStatus !== "APPROVED" || !isActionable;

                      return (
                        <Card
                          key={request.id}
                          className="transition-shadow hover:shadow-md"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold">
                                Order: {associatedOrder.orderNumber}
                              </CardTitle>
                              <Badge
                                variant={statusConfig.variant}
                                className={`text-xs ${statusConfig.className || ""}`}
                              >
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm">
                              Bypass ID: {request.id}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Package className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                Station: {workProcess.workerType}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500">
                              Request Date:{" "}
                              {format(new Date(request.createdAt), "PPP, p", {
                                locale: id,
                              })}
                            </div>

                            {request.reason && (
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">Reason:</span>{" "}
                                {request.reason}
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                disabled={isButtonDisabled}
                                onClick={() => {
                                  if (nextStation) {
                                    router.push(
                                      `/employee/orders/process/${associatedOrder.uuid}?station=${nextStation}`,
                                    );
                                  } else {
                                    router.push(
                                      `/employee/orders/detail/${associatedOrder.uuid}`,
                                    );
                                  }
                                }}
                              >
                                <ChevronsRight className="mr-2 h-4 w-4" />
                                {nextStation
                                  ? `Continue to ${nextStation.charAt(0).toUpperCase() + nextStation.slice(1)}`
                                  : "View Order"}
                              </Button>

                              {request.bypassStatus === "PENDING" && (
                                <p className="flex items-center justify-center gap-1 text-xs text-yellow-600">
                                  <Info className="h-3 w-3" />
                                  Waiting for admin approval
                                </p>
                              )}
                              {request.bypassStatus === "REJECTED" && (
                                <p className="flex items-center justify-center gap-1 text-xs text-red-600">
                                  <Info className="h-3 w-3" />
                                  This request has been rejected
                                </p>
                              )}
                              {request.bypassStatus === "APPROVED" && (
                                <p className="flex items-center justify-center gap-1 text-xs text-green-600">
                                  <Info className="h-3 w-3" />
                                  Approved. Find this order in the Station Queue
                                  to proceed.
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <CardContent className="flex h-70 flex-col items-center justify-center">
                      <Image
                        src="/laundry-worker.svg"
                        alt="No claimed orders"
                        width={200}
                        height={200}
                        className="mb-6"
                      />
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        No Bypass Request Found
                      </h3>
                      <p className="max-w-md text-gray-600">
                        Please check back later, or if you've applied filters,
                        try clearing them.
                      </p>
                    </CardContent>
                  </div>
                )}

                <div className="mt-6">
                  {totalPages > 1 && (
                    <PaginationSection
                      page={page}
                      take={itemsPerPage}
                      total={bypassData?.meta?.total || 0}
                      onChangePage={setPage}
                      hasNext={hasNext}
                      hasPrevious={hasPrevious}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ListOfBypass;
