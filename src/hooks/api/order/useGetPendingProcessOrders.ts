"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface PendingProcessOrder {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  scheduledPickupTime: string | null;
  actualPickupTime: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
  };
  address: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  customerCoordinates?: {
    latitude: number;
    longitude: number;
  } | null;
  outlet: {
    id: number;
    outletName: string;
    latitude: number;
    longitude: number;
    deliveryBaseFee: number;
    deliveryPerKm: number;
    serviceRadius: number;
  };
  pickupInfo?: {
    driver: string;
    driverPhone: string;
    scheduledOutlet: string;
    notes: string;
    completedAt: string;
  } | null;
}

interface GetPendingProcessOrdersQueries extends PaginationQueries {
  search?: string;
  customerName?: string;
}

interface UseGetPendingProcessOrdersOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface BackendResponse {
  success: boolean;
  message: string;
  data: PendingProcessOrder[];
  meta: {
    hasNext: boolean;
    hasPrevious: boolean;
    page: number;
    perPage: number;
    total: number;
  };
}

const useGetPendingProcessOrders = (
  queries?: GetPendingProcessOrdersQueries,
  options?: UseGetPendingProcessOrdersOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/orders/pending/process`;

  const queryKey = ["pending-process-orders", queries];

  const cleanQueries = Object.fromEntries(
    Object.entries({
      take: 10,
      page: 1,
      sortBy: "createdAt",
      sortOrder: "asc" as const,
      ...queries,
    }).filter(
      ([_, value]) => value !== undefined && value !== "" && value !== null,
    ),
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<BackendResponse>(endpoint, {
          params: cleanQueries,
        });

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format");
        }

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch pending process orders",
          );
        }

        const response: PageableResponse<PendingProcessOrder> = {
          data: data.data || [],
          meta: {
            page: data.meta.page,
            take: data.meta.perPage,
            total: data.meta.total,
            hasNext: data.meta.hasNext,
            hasPrevious: data.meta.hasPrevious,
          },
        };

        return response;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Failed to fetch pending process orders: ${error.message}`,
          );
        }
        throw new Error(
          "Failed to fetch pending process orders: Unknown error",
        );
      }
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 30 * 1000,
    staleTime: options?.staleTime || 1 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetPendingProcessOrders;
export type {
  GetPendingProcessOrdersQueries,
  PendingProcessOrder,
  UseGetPendingProcessOrdersOptions,
};
