"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetStationOrder from "@/hooks/api/employee/worker/useGetStationOrder";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Filter, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";

const WORK_TYPES = [
  { value: "all", label: "All Work Types" },
  { value: "washing", label: "Washing" },
  { value: "ironing", label: "Ironing" },
  { value: "packing", label: "Packing" },
];

const ListOfStationOrder = () => {
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
  const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>(
    queryDateFrom ?? undefined,
  );
  const [localDateTo, setLocalDateTo] = useState<Date | undefined>(
    queryDateTo ?? undefined,
  );
  const [localWorkerType, setLocalWorkerType] =
    useState<string>(queryWorkerType);

  const itemsPerPage = 4;
  useEffect(() => {
    setLocalDateFrom(queryDateFrom ?? undefined);
    setLocalDateTo(queryDateTo ?? undefined);
    setLocalWorkerType(queryWorkerType);
  }, [queryDateFrom, queryDateTo, queryWorkerType]);
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
    status: "completed",
    dateFrom: queryDateFrom ? format(queryDateFrom, "yyyy-MM-dd") : "",
    dateTo: queryDateTo ? format(queryDateTo, "yyyy-MM-dd") : "",
    workerType: queryWorkerType as "washing" | "ironing" | "packing" | "all",
  });
  const hasNext = stationOrder?.meta?.hasNext || false;
  const hasPrevious = stationOrder?.meta?.hasPrevious || false;
  const totalHistory = stationOrder?.meta?.total || 0;

  const handleApplyFilters = () => {
    setQueryDateFrom(localDateFrom === undefined ? null : localDateFrom);
    setQueryDateTo(localDateTo === undefined ? null : localDateTo);
    setQueryWorkerType(localWorkerType);
    setPage(1);
  };
  const clearFilters = () => {
    setQueryDateFrom(null);
    setQueryDateTo(null);
    setQueryWorkerType("all");
    setPage(1);
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setLocalWorkerType("all");
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
            {/* Filters */}
            <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-4">
              {/* Start Date */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Start Date</div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateFrom ? (
                        format(localDateFrom, "PPP", { locale: id })
                      ) : (
                        <span>Pick start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localDateFrom}
                      onSelect={setLocalDateFrom}
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <h6 className="text-sm font-medium">End Date</h6>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateTo ? (
                        format(localDateTo, "PPP", { locale: id })
                      ) : (
                        <span>Pick end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={localDateTo ?? undefined}
                      onSelect={setLocalDateTo}
                      initialFocus
                      locale={id}
                      disabled={(date) =>
                        localDateFrom ? date < localDateFrom : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* workertype */}
              <div className="space-y-2">
                <h6 className="text-sm font-medium">Work Type</h6>
                <Select
                  value={localWorkerType}
                  onValueChange={(value: string) => setLocalWorkerType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {localWorkerType === "all"
                        ? "Select Work Type"
                        : WORK_TYPES.find(
                            (type) => type.value === localWorkerType,
                          )?.label || "Select Work Type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="washing">Washing</SelectItem>
                    <SelectItem value="ironing">Ironing</SelectItem>
                    <SelectItem value="packing">Packing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h6 className="text-sm font-medium">Actions</h6>
                <div className="flex justify-end gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleApplyFilters}
                    disabled={isPending}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {isPending ? "Loading..." : "Filter"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={isPending}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListOfStationOrder;
