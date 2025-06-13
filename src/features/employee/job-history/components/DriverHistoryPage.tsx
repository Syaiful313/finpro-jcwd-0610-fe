"use client";

import PaginationSection from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetDriverJobs from "@/hooks/api/employee/driver/useGetDriverJob";
import { all } from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  CalendarIcon,
  Eye,
  Filter,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import { toast } from "sonner";

export default function DriverHistoryPage() {
  const router = useRouter();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [typeFilter, setTypeFilter] = useQueryState(
    "type",
    parseAsString.withDefault(""),
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

  const handleFilterChange = (key: string, value: any) => {
    setPage(1);
    switch (key) {
      case "type":
        setTypeFilter(value === "all" ? "" : value);
        break;
      case "dateFrom":
        setDateFromFilter(value);
        break;
      case "dateTo":
        setDateToFilter(value);
        break;
    }
  };

  const clearFilters = () => {
    setTypeFilter("");
    setDateFromFilter(null);
    setDateToFilter(null);
    setPage(1);
  };

  const handleViewDetails = (orderUuid: string) => {
    router.push(`/employee/orders/order-detail/${orderUuid}`);
  };

  const handleApplyFilters = () => {
    if (dateFromFilter && dateToFilter && dateToFilter < dateFromFilter) {
      toast.error("End date cannot be earlier than start date");
      return;
    }
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

  if (isLoading) {
    return (
      <div className="space-y-6 p-3 md:p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-3 md:p-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 md:p-6">
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
          {/* Filters */}
          <div className="bg-muted rounded-lg p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  From Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFromFilter
                        ? format(dateFromFilter, "dd MMM yyyy", {
                            locale: id,
                          })
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFromFilter ?? undefined}
                      onSelect={(date) => handleFilterChange("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  To Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateToFilter
                        ? format(dateToFilter, "dd MMM yyyy", {
                            locale: id,
                          })
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateToFilter ?? undefined}
                      onSelect={(date) => handleFilterChange("dateTo", date)}
                      disabled={(date) => {
                        return dateFromFilter ? date < dateFromFilter : false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Actions</div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Apply Filters"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Trip History</h3>
              <p className="text-muted-foreground text-sm">
                Showing {filteredHistory.length} of{" "}
                {completedJobsData?.meta?.total || 0} history
              </p>
            </div>

            <div>
              {filteredHistory.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  No delivery history found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((item) => (
                    <div
                      key={`${item.jobType}-${item.order.uuid}`}
                      className="rounded-lg border p-3 sm:p-4"
                    >
                      {/* Header - Mobile: Stack, Desktop: Side by side */}
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-full p-2 ${
                              item.jobType === "pickup"
                                ? "bg-blue-100"
                                : "bg-green-100"
                            }`}
                          >
                            {item.jobType === "pickup" ? (
                              <Package className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Truck className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold sm:text-base">
                              {item.order.orderNumber}
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {getJobTypeLabel(item.jobType)}
                            </p>
                          </div>
                          <div className="ml-auto sm:hidden">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(item.order.uuid)}
                              className="text-xs sm:text-sm"
                            >
                              <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-medium sm:text-base">
                            {formatRupiah(item.order.totalDeliveryFee)}
                          </div>
                          <div className="text-muted-foreground text-xs sm:text-sm">
                            {format(
                              new Date(item.updatedAt),
                              "dd MMM yyyy, HH:mm",
                              { locale: id },
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium sm:text-base">
                            {item.order.user.firstName}{" "}
                            {item.order.user.lastName}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span className="text-xs break-words sm:text-sm">
                            {item.order.addressLine}, {item.order.district},{" "}
                            {item.order.city}, {item.order.province}{" "}
                            {item.order.postalCode}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                            <div className="text-muted-foreground text-xs">
                              {item.order.outlet.outletName}
                            </div>
                          </div>

                          <div className="hidden items-center gap-2 sm:flex">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(item.order.uuid)}
                              className="text-xs sm:text-sm"
                            >
                              <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {itemsPerPage > 0 && (hasNext || hasPrevious) && (
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
        </CardContent>
      </Card>
    </div>
  );
}
