export const ROLE_CONFIG = {
  CUSTOMER: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Customer",
  },
  WORKER: {
    color: "bg-blue-50 text-blue-800 border-blue-300",
    label: "Worker",
  },
  ADMIN: {
    color: "bg-blue-100 text-blue-900 border-blue-400",
    label: "Admin",
  },
  DRIVER: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Driver",
  },
  OUTLET_ADMIN: {
    color: "bg-blue-100 text-blue-900 border-blue-400",
    label: "Admin Outlet",
  },
};

export const PROVIDER_CONFIG = {
  GOOGLE: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Google",
  },
  CREDENTIAL: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    label: "Email",
  },
};

export const OUTLET_USER_ROLES = {
  WORKER: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Worker",
  },
  DRIVER: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    label: "Driver",
  },
};

export const STATUS_CONFIG = {
  WAITING_FOR_PICKUP: {
    text: "Menunggu Pickup",
    variant: "secondary" as const,
  },
  DRIVER_ON_THE_WAY_TO_CUSTOMER: {
    text: "Driver Menuju Customer",
    variant: "default" as const,
  },
  ARRIVED_AT_CUSTOMER: {
    text: "Driver Sampai",
    variant: "default" as const,
  },
  DRIVER_ON_THE_WAY_TO_OUTLET: {
    text: "Menuju Outlet",
    variant: "default" as const,
  },
  ARRIVED_AT_OUTLET: {
    text: "Sampai Outlet",
    variant: "outline" as const,
  },
  BEING_WASHED: {
    text: "Sedang Dicuci",
    variant: "outline" as const,
  },
  BEING_IRONED: {
    text: "Sedang Disetrika",
    variant: "outline" as const,
  },
  BEING_PACKED: {
    text: "Sedang Dikemas",
    variant: "outline" as const,
  },
  WAITING_PAYMENT: {
    text: "Menunggu Pembayaran",
    variant: "destructive" as const,
  },
  READY_FOR_DELIVERY: {
    text: "Siap Diantar",
    variant: "default" as const,
  },
  BEING_DELIVERED_TO_CUSTOMER: {
    text: "Sedang Diantar",
    variant: "default" as const,
  },
  DELIVERED_TO_CUSTOMER: {
    text: "Terkirim",
    variant: "default" as const,
  },
  COMPLETED: {
    text: "Selesai",
    variant: "default" as const,
  },
  IN_RESOLUTION: {
    text: "Dalam Penyelesaian",
    variant: "secondary" as const,
  },
} as const;

export const SALES_REPORT_CONFIG = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  STALE_TIME: 5 * 60 * 1000,
  REFETCH_INTERVAL: 30 * 1000,

  CHART_HEIGHT: 250,
  MOBILE_CHART_HEIGHT: 200,

  DATE_FORMAT: "yyyy-MM-dd",
  DISPLAY_DATE_FORMAT: "dd/MM/yyyy",

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
  ACCESS_DENIED:
    "Akses ditolak. Anda tidak memiliki izin untuk melihat laporan ini.",
  LOADING_ERROR: "Gagal memuat data laporan. Silakan coba lagi.",
  NO_DATA: "Belum ada data untuk periode yang dipilih.",
  NETWORK_ERROR: "Koneksi bermasalah. Periksa koneksi internet Anda.",
  PERMISSION_ERROR: "Anda tidak memiliki izin untuk aksi ini.",
} as const;
