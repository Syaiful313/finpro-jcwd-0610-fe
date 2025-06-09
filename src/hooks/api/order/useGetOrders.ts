"use client";
import useAxios from "@/hooks/useAxios";
import { OrderSummary } from "@/types/order-management";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";


interface GetOrdersQueries extends PaginationQueries {
  search?: string;
  status?: string;
  outletId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

interface UseGetOrdersOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

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

  const cleanQueries = Object.fromEntries(
    Object.entries({
      take: 10,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
      ...queries,
    }).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== null,
    ),
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
        if (error instanceof Error) {
          throw new Error(`Failed to fetch orders: ${error.message}`);
        }
        throw new Error("Failed to fetch orders: Unknown error");
      }
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 2 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetOrders;
export type { GetOrdersQueries, OrderSummary as Order, UseGetOrdersOptions };
