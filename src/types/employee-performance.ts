export interface EmployeePerformanceQueries {
  outletId?: number;
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  role?: "WORKER" | "DRIVER";
  page?: number;
  take?: number;
  all?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface WorkerPerformanceData {
  employeeId: number;
  employeeName: string;
  outletName: string;
  outletId: number;
  role: "WORKER";
  totalWashingJobs: number;
  totalIroningJobs: number;
  totalPackingJobs: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
}

export interface DriverPerformanceData {
  employeeId: number;
  employeeName: string;
  outletName: string;
  outletId: number;
  role: "DRIVER";
  totalPickupJobs: number;
  totalDeliveryJobs: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
}

export type EmployeePerformanceData = WorkerPerformanceData | DriverPerformanceData;

export interface EmployeePerformanceSummary {
  totalEmployees: number;
  totalWorkers: number;
  totalDrivers: number;
  averageCompletionRate: number;
}

export interface EmployeePerformanceMeta {
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  perPage: number;
  total: number;
}

export interface EmployeePerformanceResponse {
  data: EmployeePerformanceData[];
  summary: EmployeePerformanceSummary;
  meta: EmployeePerformanceMeta;
}