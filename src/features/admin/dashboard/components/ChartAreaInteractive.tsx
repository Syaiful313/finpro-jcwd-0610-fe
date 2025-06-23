"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useGetSalesReport from "@/hooks/api/sales-report/useGetSalesReport";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  income: {
    label: "Pendapatan",
    color: "var(--color-chart-1)",
  },
  orders: {
    label: "Pesanan",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const getDateRange = (timeRange: string) => {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0];

  let startDate: string;
  let period: "daily" | "monthly" | "yearly";

  switch (timeRange) {
    case "7d":
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      startDate = sevenDaysAgo.toISOString().split("T")[0];
      period = "daily";
      break;
    case "30d":
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      startDate = thirtyDaysAgo.toISOString().split("T")[0];
      period = "daily";
      break;
    case "3m":
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      startDate = threeMonthsAgo.toISOString().split("T")[0];
      period = "monthly";
      break;
    case "1y":
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      startDate = oneYearAgo.toISOString().split("T")[0];
      period = "monthly";
      break;
    default:
      const defaultStart = new Date(now);
      defaultStart.setMonth(now.getMonth() - 3);
      startDate = defaultStart.toISOString().split("T")[0];
      period = "monthly";
  }

  return { startDate, endDate, period };
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = React.useState("3m");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d");
    }
  }, [isMobile]);

  const { startDate, endDate, period } = React.useMemo(
    () => getDateRange(timeRange),
    [timeRange],
  );

  const canAccessPage = React.useMemo(() => {
    const isAdmin = session?.user?.role === "ADMIN";
    const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
    return isAdmin || isOutletAdmin;
  }, [session?.user?.role]);

  const {
    data: salesData,
    isLoading,
    error,
  } = useGetSalesReport({
    startDate,
    endDate,
    period,
    all: true,
  });

  const chartData = React.useMemo(() => {
    if (!salesData?.data || !canAccessPage) return [];

    return salesData.data.map((item) => ({
      date: item.period,
      income: item.totalIncome,
      orders: item.totalOrders,
    }));
  }, [salesData, canAccessPage]);

  const formatXAxisTick = React.useCallback(
    (value: string) => {
      if (period === "daily") {
        const date = new Date(value);
        return date.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
      } else {
        const [year, month] = value.split("-");
        if (isMobile) {
          return `${month}/${year.slice(-2)}`;
        }
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
          "id-ID",
          {
            month: "short",
            year: "numeric",
          },
        );
      }
    },
    [period, isMobile],
  );

  const getTimeRangeLabel = React.useCallback((range: string) => {
    switch (range) {
      case "7d":
        return "7 hari terakhir";
      case "30d":
        return "30 hari terakhir";
      case "3m":
        return "3 bulan terakhir";
      case "1y":
        return "1 tahun terakhir";
      default:
        return "3 bulan terakhir";
    }
  }, []);

  if (!canAccessPage) {
    return null;
  }

  const totalIncome = salesData?.summary?.totalIncome || 0;
  const totalOrders = salesData?.summary?.totalOrders || 0;

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Pendapatan</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {formatCurrency(totalIncome)} total pendapatan dengan{" "}
            {formatNumber(totalOrders)} pesanan
          </span>
          <span className="@[540px]/card:hidden">
            {formatCurrency(totalIncome)} - {formatNumber(totalOrders)} pesanan
          </span>
        </CardDescription>
        <div className="absolute top-4 right-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="1y" className="h-8 px-2.5">
              1 Tahun
            </ToggleGroupItem>
            <ToggleGroupItem value="3m" className="h-8 px-2.5">
              3 Bulan
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              30 Hari
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              7 Hari
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 @[767px]/card:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 bulan terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1y" className="rounded-lg">
                1 Tahun
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                3 Bulan
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 Hari
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 Hari
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground text-sm">Memuat data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-red-500">Gagal memuat data</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {error.message || "Terjadi kesalahan"}
              </p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Belum ada data</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Data akan muncul setelah ada transaksi
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-income)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-income)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
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
                      if (period === "daily") {
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
                        return [formatCurrency(value as number), "Pendapatan"];
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
                fill="url(#fillIncome)"
                stroke="var(--color-income)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
