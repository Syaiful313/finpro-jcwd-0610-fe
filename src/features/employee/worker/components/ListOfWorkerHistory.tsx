import React from "react";
import WorkerHistoryFilters from "../../worker/components/WorkerHistoryFilter";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import useGetWorkerHistory from "@/hooks/api/employee/worker/useGetWorkerHistory";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileBarChart, FileText } from "lucide-react";

const ListOfWorkerHistory = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [take, setTake] = useQueryState("take", parseAsInteger.withDefault(10));
  const [dateFrom, setDateFrom] = useQueryState("dateFrom", parseAsString);
  const [dateTo, setDateTo] = useQueryState("dateTo", parseAsString);
  const [workerType, setWorkerType] = useQueryState(
    "workerType",
    parseAsString.withDefault("all"),
  );
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

  const {
    data: workerHistory,
    isLoading,
    error,
    refetch,
  } = useGetWorkerHistory({
    page,
    take,
    dateFrom: queryDateFrom ? format(queryDateFrom, "yyyy-MM-dd") : undefined,
    dateTo: queryDateTo ? format(queryDateTo, "yyyy-MM-dd") : undefined,
    workerType:
      (workerType as "washing" | "ironing" | "packing" | "all") || "all",
  });

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
    setDateFrom(null);
    setDateTo(null);
    setWorkerType("all");
    setPage(1);
  };
  return (
    <div>
      <div className="space-y-6 p-3 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <FileBarChart className="h-6 w-6" />
              Worker History List
            </CardTitle>
            <CardDescription>View and manage worker history</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <WorkerHistoryFilters
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              isPending={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListOfWorkerHistory;
