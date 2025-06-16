// constants/salesReport.ts

export const SALES_REPORT_CONFIG = {
  // Pagination
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Cache settings
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  REFETCH_INTERVAL: 30 * 1000, // 30 seconds for live data
  
  // Chart settings
  CHART_HEIGHT: 250,
  MOBILE_CHART_HEIGHT: 200,
  
  // Date formats
  DATE_FORMAT: "yyyy-MM-dd",
  DISPLAY_DATE_FORMAT: "dd/MM/yyyy",
  
  // Currency
  CURRENCY: "IDR",
  LOCALE: "id-ID",
} as const;

export const REPORT_PERIODS = [
  { value: "daily", label: "Harian" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
] as const;

export const TIME_RANGES = {
  "7d": { days: 7, period: "daily" as const, label: "7 Hari" },
  "30d": { days: 30, period: "daily" as const, label: "30 Hari" },
  "90d": { days: 90, period: "monthly" as const, label: "3 Bulan" },
  "1y": { days: 365, period: "monthly" as const, label: "1 Tahun" },
} as const;

export type TimeRangeKey = keyof typeof TIME_RANGES;

export const CHART_CONFIG = {
  income: {
    label: "Pendapatan",
    color: "var(--color-chart-1)",
  },
  orders: {
    label: "Pesanan", 
    color: "var(--color-chart-2)",
  },
} as const;

export const METRIC_CARD_GRADIENTS = {
  income: "bg-gradient-to-br from-green-500 to-green-600",
  orders: "bg-gradient-to-br from-blue-500 to-blue-600",
  average: "bg-gradient-to-br from-purple-500 to-purple-600",
  performance: "bg-gradient-to-br from-orange-500 to-orange-600",
} as const;

export const ERROR_MESSAGES = {
  ACCESS_DENIED: "Akses ditolak. Anda tidak memiliki izin untuk melihat laporan ini.",
  LOADING_ERROR: "Gagal memuat data laporan. Silakan coba lagi.",
  NO_DATA: "Belum ada data untuk periode yang dipilih.",
  NETWORK_ERROR: "Koneksi bermasalah. Periksa koneksi internet Anda.",
  PERMISSION_ERROR: "Anda tidak memiliki izin untuk aksi ini.",
} as const;