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

const BYPASS_STATUSES = [
  { value: "all", label: "Select Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

interface BypassFilterProps {
  onApply: (filters: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    status: string;
  }) => void;
  onClear: () => void;
  isPending: boolean;
}

const BypassFilter: React.FC<BypassFilterProps> = ({
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
  const [queryStatus, setQueryStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );

  const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>(
    queryDateFrom ?? undefined,
  );
  const [localDateTo, setLocalDateTo] = useState<Date | undefined>(
    queryDateTo ?? undefined,
  );
  const [localStatus, setLocalStatus] = useState<string>(queryStatus);

  useEffect(() => {
    setLocalDateFrom(queryDateFrom ?? undefined);
    setLocalDateTo(queryDateTo ?? undefined);
    setLocalStatus(queryStatus);
  }, [queryDateFrom, queryDateTo, queryStatus]);

  const handleApplyFilters = () => {
    onApply({
      dateFrom: localDateFrom === undefined ? null : localDateFrom,
      dateTo: localDateTo === undefined ? null : localDateTo,
      status: localStatus,
    });
  };

  const handleClearFilters = () => {
    setQueryDateFrom(null);
    setQueryDateTo(null);
    setQueryStatus("all");
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setLocalStatus("all");
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
      {/* Start Date */}
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

      {/* End Date */}
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

      {/* Bypass Status */}
      <div className="space-y-2">
        <h6 className="text-sm font-medium">Bypass Status</h6>
        <Select
          value={localStatus}
          onValueChange={(value: string) => setLocalStatus(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {BYPASS_STATUSES.find((status) => status.value === localStatus)
                ?.label || "Select Status"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BYPASS_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
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

export default BypassFilter;
