"use client";
import useAxios from "@/hooks/useAxios";
import { OrderDetail } from "@/types/order-management";
import { useQuery } from "@tanstack/react-query";

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
    enabled: options?.enabled !== false && !!orderId,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 1 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetOrderDetail;
export type { UseGetOrderDetailOptions };
