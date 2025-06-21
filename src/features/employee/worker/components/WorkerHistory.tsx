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
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useGetWorkerHistory from "@/hooks/api/employee/worker/useGetWorkerHistory";
import formatRupiah from "@/utils/RupiahFormat";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Eye,
  Package,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import WorkerHistoryFilters from "./WorkerHistoryFilter";
import Loader from "../../components/Loader";
import Image from "next/image";

const WorkerHistory = () => {
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

  const itemsPerPage = 6;

  const {
    data: workerHistory,
    isPending,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWorkerHistory({
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

  const hasNext = workerHistory?.meta?.hasNext || false;
  const hasPrevious = workerHistory?.meta?.hasPrevious || false;
  const totalHistory = workerHistory?.meta?.total || 0;
  const currentResults = workerHistory?.data?.length || 0;
  const totalPages = Math.ceil(totalHistory / itemsPerPage);

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

  const getWorkerTypeBadge = (type: string) => {
    const typeMap = {
      WASHING: {
        label: "Washing",
        variant: "default" as const,
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      IRONING: {
        label: "Ironing",
        variant: "secondary" as const,
        color: "bg-teal-50 text-teal-700 border-teal-200",
      },
      PACKING: {
        label: "Packing",
        variant: "outline" as const,
        color: "bg-purple-50 text-purple-700 border-purple-200",
      },
    };
    return (
      typeMap[type as keyof typeof typeMap] || {
        label: type,
        variant: "default" as const,
        color: "",
      }
    );
  };

  return (
    <div>
      <div className="space-y-6 p-3 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <User className="h-6 w-6" />
              Worker History
            </CardTitle>
            <CardDescription>
              View your completed work process history
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <WorkerHistoryFilters
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isPending={isPending}
            />
          </CardContent>

          {/* History Cards */}
          <div className="space-y-4">
            {isPending ? (
              <div className="h-70 space-y-6 p-3 md:p-6">
                <Loader />
              </div>
            ) : isError ? (
              <div className="p-4 text-center text-red-500">
                Error: {error?.message || "Failed to fetch history."}
              </div>
            ) : (
              <div className="p-3 md:p-6">
                {!isLoading && !isError && (
                  <div className="flex items-center justify-between pb-4">
                    <p className="text-muted-foreground text-sm">
                      Showing {currentResults} of {totalHistory} work history
                      records
                    </p>
                    {totalPages > 0 && (
                      <p className="text-muted-foreground text-sm">
                        Page {page} of {totalPages}
                      </p>
                    )}
                  </div>
                )}
                {workerHistory?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workerHistory.data.map((workProcess) => {
                      const workerTypeConfig = getWorkerTypeBadge(
                        workProcess.workerType,
                      );

                      return (
                        <Card
                          key={workProcess.id}
                          className="transition-shadow hover:shadow-md"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold">
                                {workProcess.order.orderNumber}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                {workProcess.bypass && (
                                  <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      </TooltipTrigger>
                                      <TooltipContent className="text-gray-700">
                                        Bypass Requested
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                <Badge
                                  variant={workerTypeConfig.variant}
                                  className={`text-xs ${workerTypeConfig.color}`}
                                >
                                  {workerTypeConfig.label}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-sm">
                              {workProcess.order.user.firstName}{" "}
                              {workProcess.order.user.lastName}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                Order Total:
                              </span>
                              <span className="text-sm font-semibold">
                                {formatRupiah(
                                  workProcess.order.totalPrice || 0,
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="text-xs">
                                Started:{" "}
                                {format(
                                  new Date(workProcess.createdAt),
                                  "PPP, p",
                                  { locale: id },
                                )}
                              </span>
                            </div>

                            {workProcess.completedAt && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                <span className="text-xs">
                                  Completed:{" "}
                                  {format(
                                    new Date(workProcess.completedAt),
                                    "PPP, p",
                                    { locale: id },
                                  )}
                                </span>
                              </div>
                            )}

                            <div className="rounded bg-gray-50 p-2 text-sm">
                              <span className="font-medium">Notes: </span>
                              {workProcess.notes || "No notes provided"}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                router.push(
                                  `/employee/job-history/${workProcess.order.uuid}`,
                                );
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Order Details
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <CardContent className="flex flex-col items-center justify-center">
                      <Image
                        src="/laundry-worker.svg"
                        alt="No claimed orders"
                        width={200}
                        height={200}
                        className="mb-6"
                      />
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        No Order History
                      </h3>
                      <p className="max-w-md text-gray-600">
                        Please check back later, or if you've applied filters,
                        try clearing them.
                      </p>
                    </CardContent>
                  </div>
                )}
                <div className="mt-6">
                  {totalPages > 0 && (
                    <PaginationSection
                      page={page}
                      take={itemsPerPage}
                      total={workerHistory?.meta?.total || 0}
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

export default WorkerHistory;
