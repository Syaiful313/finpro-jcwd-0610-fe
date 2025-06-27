"use client";

import PaginationSection from "@/components/PaginationSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetSalesReport from "@/hooks/api/sales-report/useGetSalesReport";
import {
  BarChart3,
  FileText,
  Loader2,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

const PAGE_SIZE = 10;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("id-ID").format(num);
};

const formatPeriodDisplay = (period: string, periodType: string) => {
  if (periodType === "daily") {
    return new Date(period).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else if (periodType === "monthly") {
    const [year, month] = period.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      },
    );
  } else {
    return `Tahun ${period}`;
  }
};

const getCellClass = (columnId: string) => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const styles: Record<string, string> = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    period: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    orders: "w-20 sm:w-28 text-center text-xs sm:text-sm",
    income:
      "min-w-[120px] sm:min-w-[150px] text-right text-xs sm:text-sm font-medium",
    average: "w-24 sm:w-32 text-right text-xs sm:text-sm hidden md:table-cell",
  };
  return `${baseClass} ${styles[columnId] || "text-xs sm:text-sm"}`;
};

const SalesReportCard = ({
  item,
  index,
  periodType,
}: {
  item: any;
  index: number;
  periodType: string;
}) => {
  const averageOrder =
    item.totalOrders > 0 ? item.totalIncome / item.totalOrders : 0;

  const getInitials = (period: string) => {
    if (periodType === "yearly") return period.slice(-2);
    if (periodType === "monthly") {
      const [year, month] = period.split("-");
      return `${month}/${year.slice(-2)}`;
    }
    return new Date(period).getDate().toString();
  };

  const initials = getInitials(item.period);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-blue-400 dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70">
      <div className="border-b border-slate-200 bg-slate-50 p-3.5 dark:border-gray-700 dark:bg-gray-700/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white dark:from-blue-600 dark:to-blue-700">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900 dark:text-gray-100">
              {formatPeriodDisplay(item.period, periodType)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                {formatNumber(item.totalOrders)} pesanan
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5">
        <div className="mb-3">
          <div className="mb-1 text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Total Pendapatan
          </div>
          <div className="text-lg leading-relaxed font-bold text-slate-900 dark:text-gray-100">
            {formatCurrency(item.totalIncome)}
          </div>
        </div>

        <div className="mb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              <ShoppingCart className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Jumlah Pesanan</span>
            </div>
            <span className="text-xs font-medium dark:text-gray-300">
              {formatNumber(item.totalOrders)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Rata-rata/Pesanan</span>
            </div>
            <span className="text-xs font-medium dark:text-gray-300">
              {formatCurrency(averageOrder)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesReportRow = ({
  item,
  index,
  periodType,
}: {
  item: any;
  index: number;
  periodType: string;
}) => {
  const averageOrder =
    item.totalOrders > 0 ? item.totalIncome / item.totalOrders : 0;

  return (
    <TableRow className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
      <TableCell className={getCellClass("index")}>{index}</TableCell>

      <TableCell className={getCellClass("period")}>
        <div className="flex flex-col">
          <div className="font-medium break-words text-gray-900 dark:text-gray-100">
            {formatPeriodDisplay(item.period, periodType)}
          </div>
          <div className="mt-1 text-xs break-words text-gray-500 sm:hidden dark:text-gray-400">
            {formatNumber(item.totalOrders)} pesanan
          </div>
        </div>
      </TableCell>

      <TableCell className={getCellClass("orders")}>
        <div className="text-center">
          <span className="text-sm font-medium dark:text-gray-200">
            {formatNumber(item.totalOrders)}
          </span>
        </div>
      </TableCell>

      <TableCell className={getCellClass("income")}>
        <div className="text-right font-medium text-gray-900 dark:text-gray-100">
          {formatCurrency(item.totalIncome)}
        </div>
      </TableCell>

      <TableCell className={getCellClass("average")}>
        <div className="text-muted-foreground text-right dark:text-gray-400">
          {formatCurrency(averageOrder)}
        </div>
      </TableCell>
    </TableRow>
  );
};

export function SalesReportTable() {
  const { data: session } = useSession();

  const [filters, setFilters] = useQueryStates({
    startDate: parseAsString,
    endDate: parseAsString,
    period: parseAsString,
    outletId: parseAsInteger,
    page: parseAsInteger.withDefault(1),
  });

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const canAccessPage = isAdmin || isOutletAdmin;

  if (!canAccessPage) {
    return (
      <div className="flex h-64 items-center justify-center px-1">
        <div className="text-center">
          <span className="text-sm text-red-500 sm:text-base dark:text-red-400">
            Access Denied
          </span>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            You don't have permission to view sales reports.
          </p>
        </div>
      </div>
    );
  }

  const {
    data: salesData,
    isLoading,
    error,
  } = useGetSalesReport({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    period: (filters.period as "daily" | "monthly" | "yearly") || "monthly",
    outletId: filters.outletId || undefined,
    page: filters.page,
    take: PAGE_SIZE,
  });

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const periodType = filters.period || "monthly";
  const getTableTitle = () => {
    switch (periodType) {
      case "daily":
        return "Detail Pendapatan Harian";
      case "monthly":
        return "Detail Pendapatan Bulanan";
      case "yearly":
        return "Detail Pendapatan Tahunan";
      default:
        return "Detail Pendapatan";
    }
  };

  const getPeriodColumnHeader = () => {
    switch (periodType) {
      case "daily":
        return "Tanggal";
      case "monthly":
        return "Bulan";
      case "yearly":
        return "Tahun";
      default:
        return "Periode";
    }
  };

  return (
    <>
      <div className="block sm:hidden">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span className="text-sm dark:text-gray-300">
              Memuat data laporan...
            </span>
          </div>
        ) : error ? (
          <div className="mx-3 p-4 text-center text-red-500 dark:text-red-400">
            <div className="text-sm">Kesalahan memuat data laporan</div>
            <div className="mt-1 text-xs text-red-400 dark:text-red-300">
              {error.message || "Kesalahan tidak diketahui"}
            </div>
          </div>
        ) : salesData?.data?.length ? (
          <div className="space-y-2 px-3 pt-2">
            {salesData.data.map((item, index) => (
              <SalesReportCard
                key={item.period}
                item={item}
                index={(filters.page - 1) * PAGE_SIZE + index + 1}
                periodType={periodType}
              />
            ))}
          </div>
        ) : (
          <div className="mx-5 mt-4 rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="bg-muted/50 mb-4 inline-block rounded-full p-4 dark:bg-gray-700/50">
              <BarChart3 className="text-muted-foreground h-8 w-8 dark:text-gray-400" />
            </div>
            <span className="mb-4 block text-sm text-gray-500 dark:text-gray-400">
              {filters.startDate || filters.endDate
                ? "Tidak ada data untuk periode yang dipilih"
                : "Belum ada data pendapatan"}
            </span>
          </div>
        )}
      </div>

      <div className="mx-1 hidden rounded-2xl border border-gray-200 shadow-sm sm:mx-0 sm:block dark:border-gray-700">
        <div className="rounded-t-2xl border-b border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getTableTitle()}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Rincian pendapatan per{" "}
            {periodType === "daily"
              ? "hari"
              : periodType === "monthly"
                ? "bulan"
                : "tahun"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:border-gray-700">
                <TableHead className="w-12 text-center text-xs sm:w-16 sm:text-sm dark:text-gray-300">
                  No
                </TableHead>
                <TableHead className="min-w-[150px] text-xs sm:min-w-[200px] sm:text-sm dark:text-gray-300">
                  {getPeriodColumnHeader()}
                </TableHead>
                <TableHead className="w-20 text-center text-xs sm:w-28 sm:text-sm dark:text-gray-300">
                  Jumlah Pesanan
                </TableHead>
                <TableHead className="min-w-[120px] text-right text-xs sm:min-w-[150px] sm:text-sm dark:text-gray-300">
                  Total Pendapatan
                </TableHead>
                <TableHead className="hidden w-24 text-right text-xs sm:w-32 sm:text-sm md:table-cell dark:text-gray-300">
                  Rata-rata/Pesanan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      <span className="text-sm dark:text-gray-300">
                        Memuat data laporan...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-red-500 dark:text-red-400"
                  >
                    <div>
                      <div className="text-sm">
                        Kesalahan memuat data laporan
                      </div>
                      <div className="mt-1 text-xs text-red-400 dark:text-red-300">
                        {error.message || "Kesalahan tidak diketahui"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : salesData?.data?.length ? (
                <>
                  {salesData.data.map((item, index) => (
                    <SalesReportRow
                      key={item.period}
                      item={item}
                      index={(filters.page - 1) * PAGE_SIZE + index + 1}
                      periodType={periodType}
                    />
                  ))}
                  {salesData.summary && (
                    <TableRow className="bg-muted/50 font-semibold dark:bg-gray-700/50">
                      <TableCell className="dark:text-gray-200">
                        Total
                      </TableCell>
                      <TableCell className="font-medium dark:text-gray-200">
                        Keseluruhan
                      </TableCell>
                      <TableCell className="text-center dark:text-gray-200">
                        {formatNumber(salesData.summary.totalOrders)}
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-200">
                        {formatCurrency(salesData.summary.totalIncome)}
                      </TableCell>
                      <TableCell className="hidden text-right md:table-cell dark:text-gray-200">
                        {formatCurrency(salesData.summary.averageOrderValue)}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="bg-muted/50 rounded-full p-4 dark:bg-gray-700/50">
                        <BarChart3 className="text-muted-foreground h-8 w-8 dark:text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filters.startDate || filters.endDate
                          ? "Tidak ada data untuk periode yang dipilih"
                          : "Belum ada data pendapatan"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {salesData?.meta && (
        <div className="mx-1 hidden justify-center rounded-2xl border-t bg-white px-4 py-6 sm:mx-0 sm:flex dark:border-gray-700 dark:bg-gray-800">
          <PaginationSection
            page={salesData.meta.page}
            take={PAGE_SIZE}
            total={salesData.meta.total}
            hasNext={salesData.meta.hasNext}
            hasPrevious={salesData.meta.hasPrevious}
            onChangePage={handlePageChange}
          />
        </div>
      )}

      {salesData?.meta && (
        <div className="flex justify-center rounded-2xl border-t bg-white p-3 sm:hidden dark:border-gray-700 dark:bg-gray-800">
          <PaginationSection
            page={salesData.meta.page}
            take={PAGE_SIZE}
            total={salesData.meta.total}
            hasNext={salesData.meta.hasNext}
            hasPrevious={salesData.meta.hasPrevious}
            onChangePage={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
