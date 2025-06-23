"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_PERIODS } from "@/lib/config";
import useGetOutlets from "@/hooks/api/outlet/useGetOutlets";
import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import * as React from "react";

import type { DateRange } from "react-day-picker";

export function HeaderWithFilterSalesReports() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";

  const { data: outletsData } = useGetOutlets(
    { all: true },
    { enabled: isAdmin },
  );

  const [filters, setFilters] = useQueryStates({
    startDate: parseAsString,
    endDate: parseAsString,
    period: parseAsStringEnum(["daily", "monthly", "yearly"]).withDefault(
      "monthly",
    ),
    outletId: parseAsInteger,
  });

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    console.log("Date range changed:", dateRange);

    if (dateRange?.from && dateRange?.to) {
      setFilters({
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      });
    } else if (dateRange?.from) {
      setFilters({
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: null,
      });
    } else {
      setFilters({
        startDate: null,
        endDate: null,
      });
    }
  };

  const handleReset = () => {
    setFilters({
      startDate: null,
      endDate: null,
      period: "monthly",
      outletId: null,
    });
  };

  const currentDateRange: DateRange | undefined = React.useMemo(() => {
    if (filters.startDate && filters.endDate) {
      return {
        from: new Date(filters.startDate),
        to: new Date(filters.endDate),
      };
    } else if (filters.startDate) {
      return {
        from: new Date(filters.startDate),
        to: undefined,
      };
    }
    return undefined;
  }, [filters.startDate, filters.endDate]);

  const selectedOutletName = outletsData?.data?.find(
    (outlet) => outlet.id === filters.outletId,
  )?.outletName;

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.period !== "monthly" ||
    (isAdmin && filters.outletId);

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="block sm:hidden">
        <div className="rounded-b-3xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-700">
          <div className="px-5 py-14">
            <h1 className="text-2xl font-bold">Laporan Pendapatan</h1>
            <p className="mt-2 opacity-90">
              Dashboard / Laporan / Pendapatan
              {isOutletAdmin && session?.user?.outletId && (
                <span className="ml-2">• Outlet</span>
              )}
              {isAdmin && selectedOutletName && (
                <span className="ml-2">• {selectedOutletName}</span>
              )}
            </p>
          </div>
        </div>

        <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
          <div className="mb-3">
            <DatePickerWithRange
              date={currentDateRange}
              onDateChange={handleDateRangeChange}
              placeholder="Pilih rentang tanggal"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:focus:ring-blue-400/20"
            />
          </div>

          <div className="mb-2 flex gap-2">
            <Select
              value={filters.period}
              onValueChange={(value) =>
                setFilters({ period: value as "daily" | "monthly" | "yearly" })
              }
            >
              <SelectTrigger className="flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                {REPORT_PERIODS.map((period) => (
                  <SelectItem
                    key={period.value}
                    value={period.value}
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isAdmin && outletsData?.data && (
              <Select
                value={filters.outletId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({
                    outletId: value === "all" ? null : parseInt(value),
                  })
                }
              >
                <SelectTrigger className="flex-1 rounded-xl border-2 border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="Semua Outlet" />
                </SelectTrigger>
                <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                  <SelectItem
                    value="all"
                    className="dark:text-gray-100 dark:hover:bg-gray-700"
                  >
                    Semua Outlet
                  </SelectItem>
                  {outletsData.data.map((outlet) => (
                    <SelectItem
                      key={outlet.id}
                      value={outlet.id.toString()}
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {outlet.outletName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              disabled={!hasActiveFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg sm:p-6 dark:from-blue-600 dark:to-blue-700">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold sm:text-2xl">
                Laporan Pendapatan
              </h1>
              <p className="mt-1 truncate text-sm opacity-90 sm:mt-2 sm:text-base">
                Dashboard / Laporan / Pendapatan
                {isOutletAdmin && session?.user?.outletId && (
                  <span className="ml-2">• Outlet {session.user.outletId}</span>
                )}
                {isAdmin && selectedOutletName && (
                  <span className="ml-2">• {selectedOutletName}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-1 mb-6 hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:mx-0 sm:block sm:p-4 lg:p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="lg:space-y-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex items-center gap-2 lg:flex-shrink-0">
              <div className="flex-1 lg:w-[280px]">
                <DatePickerWithRange
                  date={currentDateRange}
                  onDateChange={handleDateRangeChange}
                  placeholder="Pilih rentang tanggal"
                  className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="lg:flex-shrink-0">
              <Select
                value={filters.period}
                onValueChange={(value) =>
                  setFilters({
                    period: value as "daily" | "monthly" | "yearly",
                  })
                }
              >
                <SelectTrigger className="w-full rounded-xl border-gray-200 lg:w-[130px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                  {REPORT_PERIODS.map((period) => (
                    <SelectItem
                      key={period.value}
                      value={period.value}
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && outletsData?.data && (
              <div className="lg:flex-shrink-0">
                <Select
                  value={filters.outletId?.toString() || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      outletId: value === "all" ? null : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 lg:w-[180px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                    <SelectValue placeholder="Semua Outlet" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                    <SelectItem
                      value="all"
                      className="dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      Semua Outlet
                    </SelectItem>
                    {outletsData.data.map((outlet) => (
                      <SelectItem
                        key={outlet.id}
                        value={outlet.id.toString()}
                        className="dark:text-gray-100 dark:hover:bg-gray-700"
                      >
                        {outlet.outletName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="hidden lg:block lg:flex-1"></div>

            <div className="lg:flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full gap-2 rounded-xl border-gray-200 text-sm lg:w-auto dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                disabled={!hasActiveFilters}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {(filters.startDate || filters.endDate || filters.outletId) && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3 sm:mt-4 sm:pt-4 dark:border-gray-700">
            <span className="flex-shrink-0 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              Filter aktif:
            </span>
            {filters.startDate && filters.endDate && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {format(new Date(filters.startDate), "dd/MM")} -{" "}
                {format(new Date(filters.endDate), "dd/MM/yyyy")}
              </span>
            )}
            {isAdmin && filters.outletId && selectedOutletName && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                {selectedOutletName}
              </span>
            )}
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
              {REPORT_PERIODS.find((p) => p.value === filters.period)?.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
