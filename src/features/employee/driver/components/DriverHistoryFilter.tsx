"use client";

import React, { useEffect, useState } from "react";
import { parseAsIsoDateTime, parseAsString, useQueryState } from "nuqs";
import { format } from "date-fns";

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
import { toast } from "sonner";

const JOB_TYPES = [
  { value: "all", label: "All Types" },
  { value: "pickup", label: "Pickup" },
  { value: "delivery", label: "Delivery" },
];

interface DriverHistoryFiltersProps {
  onApply: (filters: {
    dateFrom: Date | null | undefined;
    dateTo: Date | null | undefined;
    type: string;
  }) => void;
  onClear: () => void;
}

const DriverHistoryFilters: React.FC<DriverHistoryFiltersProps> = ({
  onApply,
  onClear,
}) => {
  const [queryDateFrom, setQueryDateFrom] = useQueryState(
    "dateFrom",
    parseAsIsoDateTime,
  );
  const [queryDateTo, setQueryDateTo] = useQueryState(
    "dateTo",
    parseAsIsoDateTime,
  );
  const [queryType, setQueryType] = useQueryState(
    "type",
    parseAsString.withDefault("all"),
  );

  const [localDateFrom, setLocalDateFrom] = useState<Date | undefined>(
    queryDateFrom ?? undefined,
  );
  const [localDateTo, setLocalDateTo] = useState<Date | undefined>(
    queryDateTo ?? undefined,
  );
  const [localType, setLocalType] = useState<string>(queryType);

  useEffect(() => {
    setLocalDateFrom(queryDateFrom ?? undefined);
    setLocalDateTo(queryDateTo ?? undefined);
    setLocalType(queryType);
  }, [queryDateFrom, queryDateTo, queryType]);

  const handleApplyFilters = () => {
    if (localDateFrom && localDateTo && localDateTo < localDateFrom) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    onApply({
      dateFrom: localDateFrom === undefined ? null : localDateFrom,
      dateTo: localDateTo === undefined ? null : localDateTo,
      type: localType,
    });
  };

  const handleClearFilters = () => {
    setQueryDateFrom(null);
    setQueryDateTo(null);
    setQueryType("all");
    setLocalDateFrom(undefined);
    setLocalDateTo(undefined);
    setLocalType("all");
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
            name="dateFrom"
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

      <div className="space-y-2">
        <div className="text-sm font-medium">End Date</div>
        <div className="relative">
          <Input
            type="date"
            name="dateTo"
            value={formatDateForInput(localDateTo)}
            onChange={(e) => setLocalDateTo(parseDateFromInput(e.target.value))}
            min={getMinDateForEndDate()}
            max={today}
            className="w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Job Type</div>
        <Select
          value={localType}
          onValueChange={(value: string) => setLocalType(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {JOB_TYPES.find((type) => type.value === localType)?.label ||
                "Select Job Type"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Actions</div>
        <div className="flex justify-end gap-2">
          <Button className="flex-1" onClick={handleApplyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverHistoryFilters;
