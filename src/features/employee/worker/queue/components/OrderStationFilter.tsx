"use client";

import React, { useEffect, useState } from "react";
import {
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryState,
} from "nuqs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, Filter } from "lucide-react";

const WORK_TYPES = [
  { value: "all", label: "All Work Types" },
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

  return (
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

      {/* Work Type  */}
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
                : WORK_TYPES.find((type) => type.value === localWorkerType)
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
