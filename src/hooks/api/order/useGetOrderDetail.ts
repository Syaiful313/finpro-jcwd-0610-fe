"use client";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { OrderSummary, OrderTracking } from "./useGetOrders";

// Extended order detail with additional info
export interface OrderDetail extends OrderSummary {
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
  address: CustomerAddress;
  items: OrderItem[];
  workProcesses: WorkProcess[];
  pickupInfo: PickupJobDetail[];
  deliveryInfo: DeliveryJobDetail[];
}

export interface CustomerAddress {
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity?: number;
  weight?: number;
  pricePerUnit: number;
  totalPrice: number;
  color?: string;
  brand?: string;
  materials?: string;
  pricingType: string;
  details: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  name: string;
  qty: number;
}

export interface WorkProcess {
  id: number;
  workerType: string; // WASHING, IRONING, PACKING
  worker: {
    id: number;
    name: string;
  };
  notes?: string;
  completedAt?: string;
  createdAt: string;
  bypass?: BypassInfo;
}

export interface BypassInfo {
  id: number;
  reason: string;
  adminNote?: string;
  bypassStatus: string; // PENDING, APPROVED, REJECTED
  createdAt: string;
}

export interface PickupJobDetail {
  id: number;
  status: string; // DriverTaskStatus
  driver: {
    id: number;
    name: string;
    phoneNumber?: string;
  };
  photos?: string;
  scheduledOutlet: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryJobDetail {
  id: number;
  status: string; // DriverTaskStatus
  driver: {
    id: number;
    name: string;
    phoneNumber?: string;
  };
  photos?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseGetOrderDetailOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

const useGetOrderDetail = (
  orderId: string,
  options?: UseGetOrderDetailOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/orders/${orderId}`;
  const queryKey = ["order-detail", orderId];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<OrderDetailResponse>(endpoint);

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format");
        }

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch order detail");
        }

        return data.data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch order detail: ${error.message}`);
        }
        throw new Error("Failed to fetch order detail: Unknown error");
      }
    },
    enabled: options?.enabled !== false && !!orderId, // Only fetch if orderId exists
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 1 * 60 * 1000, // 1 minute for detailed tracking
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetOrderDetail;
export type { UseGetOrderDetailOptions };