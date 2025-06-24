"use client";

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
  Building2,
  DollarSign,
  ShoppingCart,
  TrendingUpIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

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

const LoadingCard = () => (
  <Card className="@container/card animate-pulse">
    <CardHeader className="relative">
      <CardDescription>
        <div className="h-4 w-24 rounded bg-gray-300"></div>
      </CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        <div className="h-8 w-32 rounded bg-gray-300"></div>
      </CardTitle>
      <div className="absolute top-4 right-4">
        <div className="h-6 w-16 rounded bg-gray-200"></div>
      </div>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1 text-sm">
      <div className="h-4 w-40 rounded bg-gray-200"></div>
      <div className="h-3 w-48 rounded bg-gray-200"></div>
    </CardFooter>
  </Card>
);

const SessionLoadingState = () => (
  <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

export function SectionCards() {
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.role === "ADMIN";
  const isOutletAdmin = session?.user?.role === "OUTLET_ADMIN";
  const canAccessPage = isAdmin || isOutletAdmin;

  const { data: totalIncome, isLoading: totalIncomeLoading } =
    useGetTotalIncome();

  const { data: currentMonthData, isLoading: currentMonthLoading } =
    useGetSalesReport({
      period: "monthly",
      take: 1,
    });

  const isLoading = totalIncomeLoading || currentMonthLoading;

  if (status === "loading") {
    return <SessionLoadingState />;
  }

  if (!canAccessPage) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <span className="text-sm text-red-500">Access Denied</span>
          <p className="mt-2 text-xs text-gray-500">
            Anda perlu akses admin untuk melihat dashboard ini.
          </p>
        </div>
      </div>
    );
  }

  const currentIncome = currentMonthData?.summary?.totalIncome || 0;
  const currentOrders = currentMonthData?.summary?.totalOrders || 0;
  const totalIncomeAmount = totalIncome?.totalIncome || 0;
  const totalOrdersCount = totalIncome?.totalOrders || 0;

  const cardsData = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(totalIncomeAmount),
      icon: DollarSign,
      description: "Total pendapatan keseluruhan",
      change: currentIncome > 0 ? 12.5 : 0,
    },
    {
      title: "Pendapatan Bulan Ini",
      value: formatCurrency(currentIncome),
      icon: TrendingUpIcon,
      description: "Pendapatan bulan berjalan",
      change: currentIncome > 0 ? 8.2 : 0,
    },
    {
      title: "Total Pesanan",
      value: formatNumber(totalOrdersCount),
      icon: ShoppingCart,
      description: "Pesanan yang telah selesai",
      change: currentOrders > 0 ? 5.3 : 0,
    },
    {
      title: "Pesanan Bulan Ini",
      value: formatNumber(currentOrders),
      icon: Building2,
      description: "Pesanan bulan berjalan",
      change: currentOrders > 0 ? 15.8 : 0,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
        : cardsData.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <Card key={index} className="@container/card">
                <CardHeader className="relative">
                  <CardDescription className="flex items-center gap-2">
                    <IconComponent className="text-muted-foreground h-4 w-4" />
                    {card.title}
                  </CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                  <div className="text-muted-foreground">
                    {card.description}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
    </div>
  );
}
