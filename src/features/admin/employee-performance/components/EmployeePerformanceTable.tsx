"use client";

import PaginationSection from "@/components/PaginationSection";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetEmployeePerformance from "@/hooks/api/employee-performance/useGetEmployeePerformance";
import useGetOutlets from "@/hooks/api/outlet/useGetOutlets";
import { EmployeePerformanceData } from "@/types/employee-performance";
import {
  ChevronDownIcon,
  Filter,
  FilterIcon,
  Loader2,
  Search,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    name: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    outlet:
      "min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm hidden md:table-cell",
    role: "w-24 sm:w-32 text-center",
    jobs: "w-32 sm:w-40 text-center hidden lg:table-cell",
    total: "w-20 sm:w-24 text-center",
    completion: "w-32 sm:w-40 text-center",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const RoleBadge = ({ role }: { role: string }) => {
  const getRoleBadgeStyle = (role: string) => {
    const styles = {
      WORKER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      DRIVER: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return styles[role as keyof typeof styles] || styles.WORKER;
  };

  const getLabel = (role: string) => {
    const labels = {
      WORKER: "Pekerja",
      DRIVER: "Petugas Antar Jemput ",
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getRoleBadgeStyle(role)}`}
    >
      {getLabel(role)}
    </span>
  );
};

const EmployeeCard = ({
  employee,
  index,
}: {
  employee: EmployeePerformanceData;
  index: number;
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColors = (role: string) => {
    const roleColors = {
      WORKER: { avatar: "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700" },
      DRIVER: { avatar: "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700" },
    };
    return roleColors[role as keyof typeof roleColors] || roleColors.WORKER;
  };

  const roleColors = getRoleColors(employee.role);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-900/70">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700/50 p-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 ${roleColors.avatar} flex flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white`}
          >
            {getInitials(employee.employeeName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900 dark:text-gray-100">
              {employee.employeeName}
            </div>
            <div className="flex items-center gap-1.5">
              <RoleBadge role={employee.role} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {employee.outletName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Performance Stats */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Total Pekerjaan:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {employee.totalJobs}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Selesai:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {employee.completedJobs}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tingkat Penyelesaian:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {employee.completionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={employee.completionRate} className="h-2" />
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2">
          <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
            Detail Pekerjaan:
          </div>
          {employee.role === "WORKER" ? (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2 text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {(employee as any).totalWashingJobs}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Cuci</div>
              </div>
              <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-2 text-center">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {(employee as any).totalIroningJobs}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Setrika</div>
              </div>
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-2 text-center">
                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  {(employee as any).totalPackingJobs}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Packing</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-2 text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {(employee as any).totalPickupJobs}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Pickup</div>
              </div>
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 p-2 text-center">
                <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {(employee as any).totalDeliveryJobs}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Delivery</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeeRow = ({
  employee,
  index,
}: {
  employee: EmployeePerformanceData;
  index: number;
}) => (
  <TableRow className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <TableCell className={getCellClass("index")}>{index}</TableCell>

    <TableCell className={getCellClass("name")}>
      <div className="flex flex-col">
        <div className="font-medium break-words text-gray-900 dark:text-gray-100">{employee.employeeName}</div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:hidden">
          {employee.outletName}
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("outlet")}>
      <div className="text-gray-700 dark:text-gray-300">
        {employee.outletName}
      </div>
    </TableCell>

    <TableCell className={getCellClass("role")}>
      <div className="flex justify-center">
        <RoleBadge role={employee.role} />
      </div>
    </TableCell>

    <TableCell className={getCellClass("jobs")}>
      {employee.role === "WORKER" ? (
        <div className="space-y-1 text-xs">
          <div className="text-gray-700 dark:text-gray-300">Cuci: {(employee as any).totalWashingJobs}</div>
          <div className="text-gray-700 dark:text-gray-300">Setrika: {(employee as any).totalIroningJobs}</div>
          <div className="text-gray-700 dark:text-gray-300">Packing: {(employee as any).totalPackingJobs}</div>
        </div>
      ) : (
        <div className="space-y-1 text-xs">
          <div className="text-gray-700 dark:text-gray-300">Pickup: {(employee as any).totalPickupJobs}</div>
          <div className="text-gray-700 dark:text-gray-300">Delivery: {(employee as any).totalDeliveryJobs}</div>
        </div>
      )}
    </TableCell>

    <TableCell className={getCellClass("total")}>
      <div className="space-y-1">
        <div className="font-medium text-gray-900 dark:text-gray-100">{employee.totalJobs}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {employee.completedJobs} selesai
        </div>
      </div>
    </TableCell>

    <TableCell className={getCellClass("completion")}>
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {employee.completionRate.toFixed(1)}%
        </div>
        <Progress value={employee.completionRate} className="h-2" />
      </div>
    </TableCell>
  </TableRow>
);

export function EmployeePerformanceTable() {
  const { data: session } = useSession();

  const [filters, setFilters] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    role: parseAsString.withDefault(""),
    outletId: parseAsString.withDefault(""),
    startDate: parseAsString.withDefault(""),
    endDate: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("totalJobs"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      if (filters.page !== 1 && filters.search !== debouncedSearch) {
        setFilters({ page: 1 });
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [filters.search, filters.page, debouncedSearch, setFilters]);

  const {
    data: performanceData,
    isLoading,
    error,
  } = useGetEmployeePerformance({
    page: filters.page,
    take: PAGE_SIZE,
    search: debouncedSearch,
    role: filters.role as any,
    outletId: filters.outletId ? parseInt(filters.outletId) : undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const { data: outletsData } = useGetOutlets({ all: true, isActive: true });

  const availableRoles = {
    WORKER: { label: "Pekerja" },
    DRIVER: { label: "Petugas Antar Jemput " },
  };

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters(updates);
  };

  if (!session) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm sm:text-base dark:text-gray-300">Memuat sesi...</span>
      </div>
    );
  }

  if (!isAdmin && !isOutletAdmin) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 dark:text-red-400 sm:text-base">
            Akses Ditolak
          </span>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Anda tidak memiliki izin untuk melihat halaman ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-6 sm:px-4 lg:px-0">
        {/* Mobile Header */}
        <div className="block sm:hidden">
          <div className="rounded-b-3xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg">
            {/* Header content */}
            <div className="px-4 py-14">
              <h1 className="text-2xl font-bold">Performa Karyawan</h1>
              <p className="mt-2 opacity-90">
                Pantau dan analisis performa karyawan di semua outlet
              </p>
            </div>
          </div>

          {/* Summary Cards - overlapping */}
          {performanceData?.summary && (
            <div className="relative mx-4 -mt-12 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg dark:shadow-gray-900/50">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {isLoading
                          ? "..."
                          : performanceData.summary.totalEmployees}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-lg dark:shadow-gray-900/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Rata-rata
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {isLoading
                          ? "..."
                          : `${performanceData.summary.averageCompletionRate.toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and filter section - overlapping white card */}
          <div className="relative mx-6 -mt-8 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg dark:shadow-gray-900/50">
            {/* Search input - Line 1 */}
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama karyawan..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-3.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Filter buttons - Line 2 */}
            <div className="space-y-3">
              {/* Role and Outlet filters */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-blue-500 dark:bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-700">
                      <Filter className="h-4 w-4" />
                      <span>
                        {filters.role
                          ? availableRoles[
                              filters.role as keyof typeof availableRoles
                            ]?.label
                          : "Semua Peran"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem
                      onClick={() => updateFilters({ role: "" })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Semua Peran
                    </DropdownMenuItem>
                    {Object.entries(availableRoles).map(([role, config]) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => updateFilters({ role })}
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="h-4 w-4" />
                        <span className="truncate">
                          {filters.outletId
                            ? outletsData?.data.find(
                                (o) => o.id.toString() === filters.outletId,
                              )?.outletName || "Outlet"
                            : "Semua Outlet"}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem
                        onClick={() => updateFilters({ outletId: "" })}
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        Semua Outlet
                      </DropdownMenuItem>
                      {outletsData?.data.map((outlet) => (
                        <DropdownMenuItem
                          key={outlet.id}
                          onClick={() =>
                            updateFilters({ outletId: outlet.id.toString() })
                          }
                          className="dark:hover:bg-gray-700 dark:text-gray-100"
                        >
                          {outlet.outletName}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Date filters */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      updateFilters({ startDate: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilters({ endDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Reset button */}
              <Button
                variant="outline"
                onClick={() =>
                  updateFilters({
                    search: "",
                    role: "",
                    outletId: "",
                    startDate: "",
                    endDate: "",
                    page: 1,
                  })
                }
                disabled={
                  !filters.search &&
                  !filters.role &&
                  !filters.outletId &&
                  !filters.startDate &&
                  !filters.endDate
                }
                className="h-10 w-full rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Performa Karyawan</h1>
            <p className="mt-2 opacity-90">
              Pantau dan analisis performa karyawan di semua outlet
            </p>
          </div>
        </div>

        {/* Desktop Summary Cards */}
        {performanceData?.summary && (
          <div className="hidden gap-4 px-0 sm:grid sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Karyawan
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isLoading ? "..." : performanceData.summary.totalEmployees}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pekerja</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isLoading ? "..." : performanceData.summary.totalWorkers}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-2">
                  <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isLoading ? "..." : performanceData.summary.totalDrivers}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 dark:bg-purple-950/30 p-2">
                  <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Rata-rata Penyelesaian
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isLoading
                      ? "..."
                      : `${performanceData.summary.averageCompletionRate.toFixed(1)}%`}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-2">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Search & Filter Section */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm sm:mx-0 sm:block sm:p-6">
          {/* Search Input - Line 1 */}
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Cari berdasarkan nama karyawan..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="rounded-xl border-gray-200 dark:border-gray-600 pl-12 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Filters - Line 2 */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {filters.role
                        ? availableRoles[
                            filters.role as keyof typeof availableRoles
                          ]?.label
                        : "Semua Peran"}
                    </span>
                    <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem 
                    onClick={() => updateFilters({ role: "" })}
                    className="dark:hover:bg-gray-700 dark:text-gray-100"
                  >
                    Semua Peran
                  </DropdownMenuItem>
                  {Object.entries(availableRoles).map(([role, config]) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => updateFilters({ role })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      {config.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                      <FilterIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {filters.outletId
                          ? outletsData?.data.find(
                              (o) => o.id.toString() === filters.outletId,
                            )?.outletName || "Outlet"
                          : "Semua Outlet"}
                      </span>
                      <ChevronDownIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem
                      onClick={() => updateFilters({ outletId: "" })}
                      className="dark:hover:bg-gray-700 dark:text-gray-100"
                    >
                      Semua Outlet
                    </DropdownMenuItem>
                    {outletsData?.data.map((outlet) => (
                      <DropdownMenuItem
                        key={outlet.id}
                        onClick={() =>
                          updateFilters({ outletId: outlet.id.toString() })
                        }
                        className="dark:hover:bg-gray-700 dark:text-gray-100"
                      >
                        {outlet.outletName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="outline"
                onClick={() =>
                  updateFilters({
                    search: "",
                    role: "",
                    outletId: "",
                    startDate: "",
                    endDate: "",
                    page: 1,
                  })
                }
                disabled={
                  !filters.search &&
                  !filters.role &&
                  !filters.outletId &&
                  !filters.startDate &&
                  !filters.endDate
                }
                className="h-10 rounded-xl border-gray-200 dark:border-gray-600 text-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Reset
              </Button>
            </div>

            {/* Date Range Filters */}
            <div className="grid grid-cols-2 gap-4 lg:w-80">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Tanggal Mulai
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                  className="rounded-xl border-gray-200 dark:border-gray-600 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Tanggal Akhir
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilters({ endDate: e.target.value })}
                  className="rounded-xl border-gray-200 dark:border-gray-600 text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-sm dark:text-gray-300">Memuat data performa...</span>
            </div>
          ) : error ? (
            <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
              <div className="text-sm">Kesalahan memuat data</div>
              <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                {error.message || "Kesalahan tidak diketahui"}
              </div>
            </div>
          ) : performanceData?.data?.length ? (
            <div className="space-y-2 px-3 pt-2">
              {performanceData.data.map((employee, index) => (
                <EmployeeCard
                  key={employee.employeeId}
                  employee={employee}
                  index={(filters.page - 1) * PAGE_SIZE + index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="mx-5 mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
              <span className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
                Tidak ada data performa karyawan ditemukan
              </span>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="mx-1 hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sm:mx-0 sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b dark:border-gray-700">
                  <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                    No
                  </TableHead>
                  <TableHead className="min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm dark:text-gray-300">
                    Karyawan
                  </TableHead>
                  <TableHead className="hidden min-w-[100px] text-xs sm:min-w-[120px] sm:text-sm md:table-cell dark:text-gray-300">
                    Outlet
                  </TableHead>
                  <TableHead className="w-24 text-center text-xs sm:w-32 sm:text-sm dark:text-gray-300">
                    Peran
                  </TableHead>
                  <TableHead className="hidden w-32 text-center text-xs sm:w-40 sm:text-sm lg:table-cell dark:text-gray-300">
                    Detail Pekerjaan
                  </TableHead>
                  <TableHead className="w-20 text-center text-xs sm:w-24 sm:text-sm dark:text-gray-300">
                    Total
                  </TableHead>
                  <TableHead className="w-32 text-center text-xs sm:w-40 sm:text-sm dark:text-gray-300">
                    Tingkat Penyelesaian
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        <span className="text-sm dark:text-gray-300">Memuat...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-red-500 dark:text-red-400"
                    >
                      <div>
                        <div className="text-sm">Kesalahan memuat data</div>
                        <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                          {error.message || "Kesalahan tidak diketahui"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : performanceData?.data?.length ? (
                  performanceData.data.map((employee, index) => (
                    <EmployeeRow
                      key={employee.employeeId}
                      employee={employee}
                      index={(filters.page - 1) * PAGE_SIZE + index + 1}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tidak ada data performa karyawan ditemukan
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Desktop Pagination */}
        {performanceData?.meta && (
          <div className="mx-1 hidden justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:mx-0 sm:flex">
            <PaginationSection
              page={performanceData.meta.page}
              take={performanceData.meta.perPage}
              total={performanceData.meta.total}
              hasNext={performanceData.meta.hasNext}
              hasPrevious={performanceData.meta.hasPrevious}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}

        {/* Mobile Pagination */}
        {performanceData?.meta && (
          <div className="flex justify-center rounded-2xl border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:hidden">
            <PaginationSection
              page={performanceData.meta.page}
              take={performanceData.meta.perPage}
              total={performanceData.meta.total}
              hasNext={performanceData.meta.hasNext}
              hasPrevious={performanceData.meta.hasPrevious}
              onChangePage={(newPage) => updateFilters({ page: newPage })}
            />
          </div>
        )}
      </div>
    </>
  );
}