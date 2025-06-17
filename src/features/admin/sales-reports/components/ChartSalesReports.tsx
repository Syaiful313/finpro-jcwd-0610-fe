"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useGetSalesReport from "@/hooks/api/sales-report/useGetSalesReport";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle, BarChart3, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

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

const transformSalesDataForChart = (data: any[]) => {
  return data.map((item) => ({
    date: item.period,
    income: item.totalIncome,
    orders: item.totalOrders,
  }));
};

const isPermissionError = (error: any) => {
  return error?.response?.status === 403 || error?.response?.status === 401;
};

const chartConfig = {
  income: {
    label: "Pendapatan",
    color: "var(--color-chart-3)",
  },
  orders: {
    label: "Pesanan",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex h-[200px] flex-col items-center justify-center p-4 text-center sm:h-[250px] sm:p-6">
    <div className="bg-muted/50 mb-3 rounded-full p-3 sm:mb-4 sm:p-4">
      <BarChart3 className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
    </div>
    <h3 className="mb-2 text-base font-semibold sm:text-lg">Belum Ada Data</h3>
    <p className="text-muted-foreground mb-3 max-w-sm text-sm sm:mb-4">
      Tidak ada data pendapatan untuk periode ini. Data akan muncul setelah ada
      transaksi yang selesai.
    </p>
    <Button variant="outline" onClick={onRefresh} className="gap-2 text-sm">
      <RefreshCw className="h-4 w-4" />
      Muat Ulang Data
    </Button>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: any;
  onRetry: () => void;
}) => {
  const isPermissionErr = isPermissionError(error);

  return (
    <div className="flex h-[200px] flex-col items-center justify-center p-4 text-center sm:h-[250px] sm:p-6">
      <div className="mb-3 rounded-full bg-red-50 p-3 sm:mb-4 sm:p-4">
        <AlertCircle className="h-6 w-6 text-red-500 sm:h-8 sm:w-8" />
      </div>
      <h3 className="mb-2 text-base font-semibold sm:text-lg">
        {isPermissionErr ? "Akses Ditolak" : "Gagal Memuat Data"}
      </h3>
      <p className="text-muted-foreground mb-3 max-w-sm text-sm sm:mb-4">
        {isPermissionErr
          ? "Anda tidak memiliki izin untuk melihat data ini."
          : "Terjadi kesalahan saat memuat data grafik. Silakan coba lagi."}
      </p>
      {!isPermissionErr && (
        <Button variant="outline" onClick={onRetry} className="gap-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

const LoadingState = () => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex ${isMobile ? "h-[200px]" : "h-[250px]"} items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2 sm:h-8 sm:w-8"></div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Memuat data grafik...
        </p>
      </div>
    </div>
  );
};

export function ChartSalesReports() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const [filters] = useQueryStates({
    startDate: parseAsString,
    endDate: parseAsString,
    period: parseAsString,
    outletId: parseAsInteger,
  });

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const canAccessPage = isAdmin || isOutletAdmin;

  if (!canAccessPage) {
    return null;
  }

  const {
    data: salesData,
    isLoading,
    error,
    refetch,
  } = useGetSalesReport({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    period: (filters.period as "daily" | "monthly" | "yearly") || "monthly",
    outletId: filters.outletId || undefined,

    all: true,
  });

  const chartData = React.useMemo(() => {
    if (!salesData?.data) return [];
    return transformSalesDataForChart(salesData.data);
  }, [salesData]);

  const totalIncome = salesData?.summary?.totalIncome || 0;
  const totalOrders = salesData?.summary?.totalOrders || 0;
  const hasData = chartData.length > 0;
  const periodType = filters.period || "monthly";

  const handleRefresh = () => {
    refetch();
  };

  const getChartTitle = () => {
    if (filters.startDate && filters.endDate) {
      return "Trend Pendapatan Periode Dipilih";
    }

    switch (periodType) {
      case "daily":
        return "Trend Pendapatan Harian";
      case "monthly":
        return "Trend Pendapatan Bulanan";
      case "yearly":
        return "Trend Pendapatan Tahunan";
      default:
        return "Trend Pendapatan";
    }
  };

  const formatXAxisTick = (value: string) => {
    if (periodType === "daily") {
      const date = new Date(value);
      if (isMobile) {
        return date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });
      } else {
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      }
    } else if (periodType === "monthly") {
      if (isMobile) {
        const [year, month] = value.split("-");
        return `${month}/${year.slice(-2)}`;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };

  const chartHeight = isMobile ? 200 : 250;

  return (
    <Card className="@container/card">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">
          {getChartTitle()}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {hasData ? (
            <>
              <span className="hidden @[540px]/card:block">
                {formatCurrency(totalIncome)} total pendapatan dengan{" "}
                {formatNumber(totalOrders)} pesanan
              </span>
              <span className="@[540px]/card:hidden">
                {formatCurrency(totalIncome)} - {formatNumber(totalOrders)}{" "}
                pesanan
              </span>
            </>
          ) : (
            <span>Grafik pendapatan dan jumlah pesanan per periode</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={handleRefresh} />
        ) : !hasData ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <div className="w-full">
            {/* Mobile Responsive Chart */}
            <div className="block sm:hidden">
              <ChartContainer
                config={chartConfig}
                className={`aspect-auto h-[${chartHeight}px] w-full`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="fillIncomeMobile"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-income)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-income)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={20}
                      fontSize={10}
                      tickFormatter={formatXAxisTick}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => {
                            if (periodType === "daily") {
                              return new Date(value).toLocaleDateString(
                                "id-ID",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              );
                            } else {
                              return `Periode ${value}`;
                            }
                          }}
                          formatter={(value, name) => {
                            if (name === "income") {
                              return [
                                formatCurrency(value as number),
                                "Pendapatan",
                              ];
                            } else if (name === "orders") {
                              return [`${value} pesanan`, "Total Pesanan"];
                            }
                            return [value, name];
                          }}
                          indicator="dot"
                        />
                      }
                    />
                    <Area
                      dataKey="income"
                      type="monotone"
                      fill="url(#fillIncomeMobile)"
                      stroke="var(--color-income)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Desktop Chart */}
            <div className="hidden sm:block">
              <ChartContainer
                config={chartConfig}
                className={`aspect-auto h-[${chartHeight}px] w-full`}
              >
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="fillIncomeDesktop"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-income)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-income)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={formatXAxisTick}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          if (periodType === "daily") {
                            return new Date(value).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          } else {
                            return `Periode ${value}`;
                          }
                        }}
                        formatter={(value, name) => {
                          if (name === "income") {
                            return [
                              formatCurrency(value as number),
                              "Pendapatan",
                            ];
                          } else if (name === "orders") {
                            return [`${value} pesanan`, "Total Pesanan"];
                          }
                          return [value, name];
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="income"
                    type="natural"
                    fill="url(#fillIncomeDesktop)"
                    stroke="var(--color-income)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
