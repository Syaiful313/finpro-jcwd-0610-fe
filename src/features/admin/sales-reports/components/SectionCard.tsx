"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetSalesReport from "@/hooks/api/sales-report/useGetSalesReport";
import useGetTotalIncome from "@/hooks/api/sales-report/useGetTotalIncome";
import {
  DollarSign,
  ShoppingCart,
  TrendingDownIcon,
  TrendingUp,
  TrendingUpIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

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

const getMetricCardGradient = (title: string) => {
  const gradientMap: Record<string, string> = {
    "Total Pendapatan": "bg-gradient-to-br from-blue-500 to-blue-600",
    "Jumlah Pesanan": "bg-gradient-to-br from-green-500 to-green-600",
    "Rata-rata per Pesanan": "bg-gradient-to-br from-purple-500 to-purple-600",
    Performa: "bg-gradient-to-br from-orange-500 to-orange-600",
  };
  return gradientMap[title] || "bg-gradient-to-br from-gray-500 to-gray-600";
};

const getPerformanceColor = (changeDirection: string) => {
  switch (changeDirection) {
    case "increase":
      return "border-green-200 bg-green-50 text-green-700";
    case "decrease":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

const MetricCard = ({
  title,
  value,
  icon: IconComponent,
  description,
  change,
  changeDirection,
}: {
  title: string;
  value: string;
  icon: any;
  description: string;
  change: number;
  changeDirection: string;
}) => {
  const isPositive = changeDirection === "increase";
  const isNegative = changeDirection === "decrease";
  const TrendIcon = isPositive
    ? TrendingUpIcon
    : isNegative
      ? TrendingDownIcon
      : TrendingUp;

  const gradientClass = getMetricCardGradient(title);

  return (
    <div className="overflow-hidden rounded-2xl border-l-4 border-blue-500 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 p-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`h-9 w-9 ${gradientClass} flex flex-shrink-0 items-center justify-center rounded-full text-white`}
          >
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap text-slate-900">
              {title}
            </div>
            {change !== 0 && (
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`flex gap-1 rounded-lg text-xs ${getPerformanceColor(changeDirection)}`}
                >
                  <TrendIcon className="size-3" />
                  {isPositive ? "+" : ""}
                  {Math.abs(change).toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {/* Value */}
        <div className="mb-3">
          <div className="text-2xl leading-relaxed font-bold text-slate-900">
            {value}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs text-gray-600">{description}</div>
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
    <div className="animate-pulse border-b border-slate-200 bg-slate-50 p-3.5">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-gray-300"></div>
        <div className="flex-1">
          <div className="mb-1 h-4 rounded bg-gray-300"></div>
          <div className="h-3 w-2/3 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
    <div className="p-3.5">
      <div className="mb-3 h-8 rounded bg-gray-300"></div>
      <div className="h-3 rounded bg-gray-200"></div>
    </div>
  </div>
);

const AccessDeniedState = () => (
  <div className="flex h-64 items-center justify-center px-1">
    <div className="text-center">
      <span className="text-sm text-red-500 sm:text-base">Access Denied</span>
      <p className="mt-2 text-xs text-gray-500 sm:text-sm">
        Anda perlu akses admin atau outlet admin untuk melihat metrik ini.
      </p>
    </div>
  </div>
);

export function SectionCards() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const canAccessPage = isAdmin || isOutletAdmin;

  const [filters] = useQueryStates({
    startDate: parseAsString,
    endDate: parseAsString,
    outletId: parseAsInteger,
  });

  if (!canAccessPage) {
    return <AccessDeniedState />;
  }

  const { data: totalIncome, isLoading: totalIncomeLoading } =
    useGetTotalIncome({
      outletId: isAdmin ? filters.outletId || undefined : undefined,
    });

  const { data: salesData, isLoading: salesLoading } = useGetSalesReport({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    outletId: isAdmin ? filters.outletId || undefined : undefined,
    period: "monthly",
  });

  const isLoading = totalIncomeLoading || salesLoading;

  const currentIncome = salesData?.summary?.totalIncome || 0;
  const currentOrders = salesData?.summary?.totalOrders || 0;
  const currentAverage = salesData?.summary?.averageOrderValue || 0;

  const cardsData = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(currentIncome),
      icon: DollarSign,
      description: "Pendapatan selesai dalam periode ini",
      change: 0,
      changeDirection: "stable",
    },
    {
      title: "Jumlah Pesanan",
      value: formatNumber(currentOrders),
      icon: ShoppingCart,
      description: "Pesanan selesai dalam periode ini",
      change: 0,
      changeDirection: "stable",
    },
    {
      title: "Rata-rata per Pesanan",
      value: formatCurrency(currentAverage),
      icon: TrendingUp,
      description: "Nilai rata-rata per pesanan",
      change: 0,
      changeDirection: "stable",
    },
    {
      title: "Status",
      value: currentIncome > 0 ? "Aktif" : "Belum Ada Data",
      icon: TrendingUp,
      description: "Status laporan penjualan",
      change: 0,
      changeDirection: "stable",
    },
  ];

  return (
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {isLoading ? (
          <div className="space-y-2 px-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-2 px-3">
            {cardsData.map((cardItem, index) => (
              <MetricCard
                key={index}
                title={cardItem.title}
                value={cardItem.value}
                icon={cardItem.icon}
                description={cardItem.description}
                change={cardItem.change}
                changeDirection={cardItem.changeDirection}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="mx-1 hidden grid-cols-1 gap-4 sm:mx-0 sm:grid @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="from-primary/5 to-card @container/card animate-pulse bg-gradient-to-t"
              >
                <CardHeader className="relative">
                  <CardDescription className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-300"></div>
                    <div className="h-4 w-20 rounded bg-gray-300"></div>
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <div className="h-8 w-24 rounded bg-gray-300"></div>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-3 w-full rounded bg-gray-200"></div>
                </CardFooter>
              </Card>
            ))
          : cardsData.map((cardItem, index) => {
              const IconComponent = cardItem.icon;
              const isPositive = cardItem.changeDirection === "increase";
              const isNegative = cardItem.changeDirection === "decrease";
              const TrendIcon = isPositive
                ? TrendingUpIcon
                : isNegative
                  ? TrendingDownIcon
                  : TrendingUp;

              return (
                <Card
                  key={index}
                  className="from-primary/5 to-card @container/card bg-gradient-to-t"
                >
                  <CardHeader className="relative">
                    <CardDescription className="flex items-center gap-2">
                      <IconComponent className="text-muted-foreground h-4 w-4" />
                      {cardItem.title}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {cardItem.value}
                    </CardTitle>
                    {cardItem.change !== 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="outline"
                          className={`flex gap-1 rounded-lg text-xs ${getPerformanceColor(cardItem.changeDirection)}`}
                        >
                          <TrendIcon className="size-3" />
                          {isPositive ? "+" : ""}
                          {Math.abs(cardItem.change).toFixed(1)}%
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="text-muted-foreground">
                      {cardItem.description}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
      </div>
    </>
  );
}
