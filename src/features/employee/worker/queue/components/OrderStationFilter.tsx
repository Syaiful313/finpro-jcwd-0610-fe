"use client";

import React, { useEffect, useState } from "react";
import { parseAsIsoDateTime, parseAsString, useQueryState } from "nuqs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const WORK_TYPES = [
  { value: "all", label: "Select Work Type" },
  { value: "washing", label: "Washing" },
  { value: "ironing", label: "Ironing" },
  { value: "packing", label: "Packing" },
];

interface StationOrderFiltersProps {
  onApply: (filters: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    workerType: string;
  }) => void;
  onClear: () => void;
  isPending: boolean;
}

const StationOrderFilters: React.FC<StationOrderFiltersProps> = ({
  onApply,
  onClear,
  isPending,
}) => {
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

  useEffect(() => {
    setLocalDateFrom(queryDateFrom ?? undefined);
    setLocalDateTo(queryDateTo ?? undefined);
    setLocalWorkerType(queryWorkerType);
  }, [queryDateFrom, queryDateTo, queryWorkerType]);

  const handleApplyFilters = () => {
    onApply({
      dateFrom: localDateFrom === undefined ? null : localDateFrom,
      dateTo: localDateTo === undefined ? null : localDateTo,
      workerType: localWorkerType,
    });
  };

  const handleClearFilters = () => {
    setQueryDateFrom(null);
    setQueryDateTo(null);
    setQueryWorkerType("all");
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setLocalWorkerType("all");
    onClear();
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const getMinDateForEndDate = (): string => {
    if (localDateFrom) {
      return format(localDateFrom, "yyyy-MM-dd");
    }
    return "";
  };

  return (
    <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Start Date</div>
        <div className="relative">
          <Input
            type="date"
            value={formatDateForInput(localDateFrom)}
            onChange={(e) =>
              setLocalDateFrom(parseDateFromInput(e.target.value))
            }
            max={today}
            placeholder="Select start date"
            className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h6 className="text-sm font-medium">End Date</h6>
        <div className="relative">
          <Input
            type="date"
            value={formatDateForInput(localDateTo)}
            onChange={(e) => setLocalDateTo(parseDateFromInput(e.target.value))}
            min={getMinDateForEndDate()}
            max={today}
            placeholder="Select end date"
            className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h6 className="text-sm font-medium">Work Type</h6>
        <Select
          value={localWorkerType}
          onValueChange={(value: string) => setLocalWorkerType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select work type">
              {WORK_TYPES.find((type) => type.value === localWorkerType)
                ?.label || "Select Work Type"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {WORK_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h6 className="text-sm font-medium">Actions</h6>
        <div className="flex justify-end gap-2">
          <Button
            className="flex-1"
            onClick={handleApplyFilters}
            disabled={isPending}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isPending}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StationOrderFilters;
