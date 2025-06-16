// utils/salesReportUtils.ts
import { SALES_REPORT_CONFIG, TIME_RANGES, TimeRangeKey, METRIC_CARD_GRADIENTS } from "@/constants/salesReport";

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(SALES_REPORT_CONFIG.LOCALE, {
    style: "currency",
    currency: SALES_REPORT_CONFIG.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Number formatting
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat(SALES_REPORT_CONFIG.LOCALE).format(num);
};

// Percentage formatting
export const formatPercentage = (percentage: number, decimals: number = 1): string => {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(decimals)}%`;
};

// Period display formatting
export const formatPeriodDisplay = (period: string, periodType: string): string => {
  switch (periodType) {
    case "daily":
      return new Date(period).toLocaleDateString(SALES_REPORT_CONFIG.LOCALE, {
        weekday: "long",
        day: "numeric",
        month: "long", 
        year: "numeric",
      });
    case "monthly":
      const [year, month] = period.split("-");
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
        SALES_REPORT_CONFIG.LOCALE,
        {
          month: "long",
          year: "numeric",
        }
      );
    case "yearly":
      return `Tahun ${period}`;
    default:
      return period;
  }
};

// Short period display for mobile
export const formatPeriodShort = (period: string, periodType: string): string => {
  switch (periodType) {
    case "daily":
      return new Date(period).toLocaleDateString(SALES_REPORT_CONFIG.LOCALE, {
        day: "2-digit",
        month: "short",
      });
    case "monthly":
      const [year, month] = period.split("-");
      return `${month}/${year.slice(-2)}`;
    case "yearly":
      return period.slice(-2);
    default:
      return period;
  }
};

// Date range helpers
export const getDateRangeFromTimeRange = (timeRange: TimeRangeKey) => {
  const config = TIME_RANGES[timeRange];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - config.days);

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    period: config.period,
  };
};

export const getDateRange = (timeRange: TimeRangeKey, currentFilters: any) => {
  // If user has set custom date range, use that
  if (currentFilters.startDate && currentFilters.endDate) {
    return {
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
      period: currentFilters.period || "monthly",
    };
  }

  // Otherwise use quick select date ranges
  return getDateRangeFromTimeRange(timeRange);
};

// Calculate average order value
export const calculateAverageOrderValue = (totalIncome: number, totalOrders: number): number => {
  return totalOrders > 0 ? totalIncome / totalOrders : 0;
};

// Performance direction helpers
export const getPerformanceColor = (direction: string) => {
  switch (direction) {
    case "increase":
      return "border-green-200 bg-green-50 text-green-600";
    case "decrease":
      return "border-red-200 bg-red-50 text-red-600";
    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
};

// Get table column classes
export const getTableColumnClass = (columnId: string): string => {
  const baseClass = "py-2 px-2 sm:py-3 sm:px-4";
  const columnStyles = {
    index: "w-12 sm:w-16 text-center text-xs sm:text-sm",
    period: "min-w-[150px] sm:min-w-[200px] text-xs sm:text-sm font-medium",
    orders: "w-20 sm:w-28 text-center text-xs sm:text-sm",
    income: "min-w-[120px] sm:min-w-[150px] text-right text-xs sm:text-sm font-medium",
    average: "w-24 sm:w-32 text-right text-xs sm:text-sm hidden md:table-cell",
  };
  
  return `${baseClass} ${columnStyles[columnId as keyof typeof columnStyles] || "text-xs sm:text-sm"}`;
};

// Generate gradient class for metric cards
export const getMetricCardGradient = (type: string): string => {
  if (type.includes("Pendapatan")) return METRIC_CARD_GRADIENTS.income;
  if (type.includes("Pesanan")) return METRIC_CARD_GRADIENTS.orders;
  if (type.includes("Rata-rata")) return METRIC_CARD_GRADIENTS.average;
  return METRIC_CARD_GRADIENTS.performance;
};

// Error type checking
export const isPermissionError = (error: any): boolean => {
  return error?.response?.status === 403;
};

export const isNetworkError = (error: any): boolean => {
  return !error?.response && error?.code === "NETWORK_ERROR";
};

// Chart data transformation
export const transformSalesDataForChart = (salesData: any[]) => {
  return salesData.map((item) => ({
    date: item.period,
    income: item.totalIncome,
    orders: item.totalOrders,
    averageOrderValue: calculateAverageOrderValue(item.totalIncome, item.totalOrders),
  }));
};

// Get initials for mobile cards
export const getPeriodInitials = (period: string, periodType: string): string => {
  if (periodType === "yearly") return period.slice(-2);
  if (periodType === "monthly") {
    const [year, month] = period.split("-");
    return `${month}/${year.slice(-2)}`;
  }
  return new Date(period).getDate().toString();
};