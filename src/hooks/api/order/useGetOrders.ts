"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

// Enhanced Order Types to match backend response
export interface OrderSummary {
  uuid: string;
  orderNumber: string;
  orderStatus: string; // OrderStatus enum values
  totalWeight: number;
  totalPrice: number;
  paymentStatus: string; // PaymentStatus enum values
  createdAt: string;
  updatedAt: string;
  customer: CustomerSummary;
  outlet: OutletSummary;
  tracking: OrderTracking; // ✅ Enhanced tracking info
}

export interface CustomerSummary {
  id: number;
  name: string;
  email: string;
}

export interface OutletSummary {
  id: number;
  outletName: string;
}

// Enhanced Tracking Information (matches backend)
export interface OrderTracking {
  currentWorker: CurrentWorker | null;
  processHistory: ProcessHistory[];
  pickup: PickupInfo | null;
  delivery: DeliveryInfo | null;
  timeline: TimelineEvent[];
}

export interface CurrentWorker {
  id: number;
  name: string;
  workerType: string; // WASHING, IRONING, PACKING
  station: string; // Human-readable station name
  startedAt: string;
  notes?: string;
  hasBypass: boolean;
}

export interface ProcessHistory {
  station: string;
  worker: string;
  startedAt: string;
  completedAt: string;
  duration: string; // e.g., "2h 30m"
  notes?: string;
  hasBypass: boolean;
}

export interface PickupInfo {
  id: number;
  driver: string;
  status: string; // DriverTaskStatus
  assignedAt: string;
  lastUpdate: string;
}

export interface DeliveryInfo {
  id: number;
  driver: string;
  status: string; // DriverTaskStatus
  assignedAt: string;
  lastUpdate: string;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  description: string;
  worker?: string;
  notes?: string;
  hasBypass?: boolean;
}

// Query interface with enhanced filters
interface GetOrdersQueries extends PaginationQueries {
  search?: string;
  status?: string;
  outletId?: string; // Only for Super Admin
  employeeId?: string; // For tracking by worker/driver
  startDate?: string; // For date range filtering (YYYY-MM-DD)
  endDate?: string; // For date range filtering (YYYY-MM-DD)
}

interface UseGetOrdersOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

// Backend response format
interface GetOrdersResponse {
  success: boolean;
  message: string;
  data: OrderSummary[];
  meta: {
    page: number;
    take: number;
    count: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const useGetOrders = (
  queries?: GetOrdersQueries,
  options?: UseGetOrdersOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/orders`;
  const queryKey = ["orders", queries];
  
  // Enhanced default values
  const cleanQueries = Object.fromEntries(
    Object.entries({
      take: 10,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
      ...queries,
    }).filter(([_, value]) => value !== undefined && value !== "" && value !== null)
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<GetOrdersResponse>(endpoint, {
          params: cleanQueries,
        });

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format");
        }

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        // Transform to PageableResponse format
        const response: PageableResponse<OrderSummary> = {
          data: data.data,
          meta: {
            page: data.meta.page,
            take: data.meta.take,
            total: data.meta.count,
            hasNext: data.meta.hasNextPage,
            hasPrevious: data.meta.hasPreviousPage,
          },
        };

        return response;
      } catch (error) {
        // Enhanced error handling
        if (error instanceof Error) {
          throw new Error(`Failed to fetch orders: ${error.message}`);
        }
        throw new Error("Failed to fetch orders: Unknown error");
      }
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 2 * 60 * 1000, // 2 minutes for order data (more frequent for real-time tracking)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetOrders;
export type { 
  GetOrdersQueries, 
  UseGetOrdersOptions, 
  OrderSummary as Order // ✅ Export as Order for backward compatibility
};