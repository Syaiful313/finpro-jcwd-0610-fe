"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    orderItems: number;
  };
}

interface GetLaundryItemsQueries extends PaginationQueries {
  search?: string;
  isActive?: boolean;
  category?: string;
  pricingType?: "PER_PIECE" | "PER_KG";
  all?: boolean;
}

interface UseGetLaundryItemsOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

const useGetLaundryItems = (
  queries?: GetLaundryItemsQueries,
  options?: UseGetLaundryItemsOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/laundry-item`;
  const queryKey = ["laundryItems", queries];
  const defaultQueries = {
    take: 10,
    page: 1,
    sortBy: "name",
    sortOrder: "asc" as const,
    isActive: true,
    ...queries,
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<PageableResponse<LaundryItem>>(
          endpoint,
          {
            params: defaultQueries,
          },
        );

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format");
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetLaundryItems;
export type { GetLaundryItemsQueries, UseGetLaundryItemsOptions, LaundryItem };