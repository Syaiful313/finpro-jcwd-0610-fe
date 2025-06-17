export type ReportPeriod = "daily" | "monthly" | "yearly";

export interface SalesReportQueries {
  startDate?: string;
  endDate?: string;
  period?: ReportPeriod;
  outletId?: number;
  page?: number;
  take?: number;
  all?: boolean;
}

export interface TotalIncomeQueries {
  outletId?: number;
  startDate?: string;
  endDate?: string;
}

export interface OutletComparisonQueries {
  startDate?: string;
  endDate?: string;
  page?: number;
  take?: number;
  all?: boolean;
}

export interface SalesReportData {
  period: string;
  totalIncome: number;
  totalOrders: number;
  outletId?: number;
  outletName?: string;
}

export interface SalesReportSummary {
  totalIncome: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface SalesReportMeta {
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  perPage: number;
  total: number;
}

export interface SalesReportResponse {
  data: SalesReportData[];
  summary: SalesReportSummary;
  meta: SalesReportMeta;
}

export interface TotalIncomeResponse {
  totalIncome: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface OutletComparisonData {
  outletId: number;
  outletName: string;
  totalIncome: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface OutletComparisonResponse {
  data: OutletComparisonData[];
  meta: SalesReportMeta;
}
