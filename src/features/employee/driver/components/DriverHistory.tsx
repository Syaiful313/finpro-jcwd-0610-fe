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
import useGetDriverJobs from "@/hooks/api/employee/driver/useGetDriverJob";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Eye, MapPin, Package, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import DriverHistoryFilters from "./DriverHistoryFilter";
import Loader from "../../components/Loader";

export default function DriverHistory() {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    parseAsString.withDefault("all"),
  );
  const [dateFromFilter, setDateFromFilter] = useQueryState(
    "dateFrom",
    parseAsIsoDateTime,
  );
  const [dateToFilter, setDateToFilter] = useQueryState(
    "dateTo",
    parseAsIsoDateTime,
  );

  const getJobType = (): "pickup" | "delivery" | "all" => {
    if (typeFilter === "pickup" || typeFilter === "delivery") {
      return typeFilter;
    }
    return "all";
  };

  const itemsPerPage = 4;

  const {
    data: completedJobsData,
    isLoading,
    isError,
    error,
  } = useGetDriverJobs({
    take: itemsPerPage,
    page: page,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "completed",
    jobType: getJobType(),
    dateFrom: dateFromFilter
      ? dateFromFilter.toISOString().split("T")[0]
      : undefined,
    dateTo: dateToFilter ? dateToFilter.toISOString().split("T")[0] : undefined,
  });

  const hasNext = completedJobsData?.meta?.hasNext || false;
  const hasPrevious = completedJobsData?.meta?.hasPrevious || false;
  const totalHistory = completedJobsData?.meta?.total || 0;
  const currentResults = completedJobsData?.data?.length || 0;
  const totalPages = Math.ceil(totalHistory / itemsPerPage);

  const handleApplyFilters = ({
    dateFrom,
    dateTo,
    type,
  }: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    type: string;
  }) => {
    setDateFromFilter(dateFrom === undefined ? null : dateFrom);
    setDateToFilter(dateTo === undefined ? null : dateTo);
    setTypeFilter(type === "all" ? "all" : type);
    setPage(1);
  };

  const handleClearFilters = () => {
    setPage(1);
  };

  // const handleViewDetails = (jobId: number, jobType: "pickup" | "delivery") => {
  //   router.push(`/employee/orders/order-detail/${orderUuid}`);
  // };

  const handleViewDetails = (jobId: number, jobType: "pickup" | "delivery") => {
    router.push(`/employee/job-history/driver/${jobId}?type=${jobType}`);
  };

  const filteredHistory = completedJobsData?.data || [];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getJobTypeLabel = (jobType: string) => {
    return jobType === "pickup" ? "Pickup" : "Delivery";
  };

  return (
    <div className="space-y-6 p-3 md:p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Truck className="h-6 w-6" />
            Driver History
          </CardTitle>
          <CardDescription>
            View and filter completed delivery jobs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DriverHistoryFilters
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </CardContent>

        {/* History List */}
        <div className="p-4 md:p-6">
          {!isLoading && !isError && (
            <div className="flex flex-col items-start gap-1 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <p className="text-muted-foreground text-sm">
                Showing {currentResults} of {totalHistory} delivery history
                records
              </p>

              {totalPages > 0 && (
                <p className="text-muted-foreground text-sm">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>
          )}

          <div>
            {isLoading ? (
              <div>
                <Loader />
              </div>
            ) : isError ? (
              <Card>
                <CardContent className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <p className="text-red-500">
                      Error loading data: {error?.message}
                    </p>
                    <Button className="mt-4">Retry</Button>
                  </div>
                </CardContent>
              </Card>
            ) : filteredHistory.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                No delivery history found for the selected filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div
                    // key={`${item.jobType}-${item.order.uuid}`}
                    key={`${item.jobType}-${item.id}`}
                    className="rounded-lg border p-4"
                  >
                    {/* Header - Mobile: Stack, Desktop: Side by side */}
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            item.jobType === "pickup"
                              ? "bg-blue-100 dark:bg-blue-900/40"
                              : "bg-green-100 dark:bg-green-900/40"
                          }`}
                        >
                          {item.jobType === "pickup" ? (
                            <Package className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Truck className="h-4 w-4 text-green-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold sm:text-base">
                            {item.order.orderNumber}
                          </h3>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {getJobTypeLabel(item.jobType)}
                          </p>
                        </div>
                      </div>

                      {/* Price and Date - Stack on mobile */}
                      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right">
                        <div className="text-sm font-medium sm:text-base">
                          {formatRupiah(item.order.totalDeliveryFee)}
                        </div>
                        <div className="text-muted-foreground text-xs sm:mt-1 sm:text-sm">
                          {format(
                            new Date(item.updatedAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id },
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Customer Name */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium sm:text-base">
                          {item.order.user.firstName} {item.order.user.lastName}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                          {item.order.addressLine}, {item.order.district},{" "}
                          {item.order.city}, {item.order.province}{" "}
                          {item.order.postalCode}
                        </span>
                      </div>

                      {/* Bottom section - Outlet and Button */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-muted-foreground text-xs sm:text-sm">
                          {item.order.outlet.outletName}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewDetails(item.id, item.jobType)
                          }
                          className="px-3 py-1.5 text-xs sm:text-sm"
                        >
                          <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && itemsPerPage > 0 && (hasNext || hasPrevious) && (
              <div className="mt-8">
                <PaginationSection
                  page={page}
                  take={itemsPerPage}
                  total={completedJobsData?.meta?.total || 0}
                  onChangePage={setPage}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
