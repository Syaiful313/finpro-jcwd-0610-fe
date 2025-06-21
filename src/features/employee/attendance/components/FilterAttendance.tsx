"use client";

import React, { useEffect, useState } from "react";
import {
  parseAsIsoDateTime,
  parseAsString,
  parseAsInteger,
  useQueryState,
} from "nuqs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AttendanceFiltersProps {
  onApply: (filters: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    searchTerm: string;
    employeeId: number | undefined;
  }) => void;
  onClear: () => void;
  isPending: boolean;
  showEmployeeSearch?: boolean;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  onApply,
  onClear,
  isPending,
  showEmployeeSearch = true,
}) => {
  const [queryDateFrom, setQueryDateFrom] = useQueryState(
    "startDate",
    parseAsIsoDateTime,
  );
  const [queryDateTo, setQueryDateTo] = useQueryState(
    "endDate",
    parseAsIsoDateTime,
  );
  const [querySearchTerm, setQuerySearchTerm] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [queryEmployeeId, setQueryEmployeeId] = useQueryState(
    "employeeId",
    parseAsInteger,
  );

  const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>(
    queryDateFrom ?? undefined,
  );
  const [localDateTo, setLocalDateTo] = useState<Date | undefined>(
    queryDateTo ?? undefined,
  );
  const [localSearchTerm, setLocalSearchTerm] =
    useState<string>(querySearchTerm);
  const [localEmployeeId, setLocalEmployeeId] = useState<number | undefined>(
    queryEmployeeId ?? undefined,
  );

  useEffect(() => {
    setLocalDateFrom(queryDateFrom ?? undefined);
    setLocalDateTo(queryDateTo ?? undefined);
    setLocalSearchTerm(querySearchTerm);
    setLocalEmployeeId(queryEmployeeId ?? undefined);
  }, [queryDateFrom, queryDateTo, querySearchTerm, queryEmployeeId]);

  const handleApplyFilters = () => {
    onApply({
      dateFrom: localDateFrom === undefined ? null : localDateFrom,
      dateTo: localDateTo === undefined ? null : localDateTo,
      searchTerm: localSearchTerm,
      employeeId: localEmployeeId,
    });
  };

  const handleClearFilters = () => {
    setQueryDateFrom(null);
    setQueryDateTo(null);
    setQuerySearchTerm("");
    setQueryEmployeeId(null);
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setLocalSearchTerm("");
    setLocalEmployeeId(undefined);
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
            className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      {/* Search Employee */}
      {showEmployeeSearch ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">Search Employee</div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      ) : (
        <div />
      )}

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

export default AttendanceFilters;
