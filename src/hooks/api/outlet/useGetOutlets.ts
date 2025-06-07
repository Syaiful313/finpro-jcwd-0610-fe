"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface Outlet {
  id: number;
  outletName: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    employees: number;
    orders: number;
  };
}

interface GetOutletsQueries extends PaginationQueries {
  search?: string;
  isActive?: boolean;
  all?: boolean;
}

interface UseGetOutletsOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

const useGetOutlets = (
  queries?: GetOutletsQueries,
  options?: UseGetOutletsOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/outlet`;
  const queryKey = ["outlets", queries];
  const defaultQueries = {
    take: 10,
    page: 1,
    sortBy: "outletName",
    sortOrder: "asc" as const,
    isActive: true,
    ...queries,
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<PageableResponse<Outlet>>(
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

export default useGetOutlets;
export type { GetOutletsQueries, UseGetOutletsOptions, Outlet };
