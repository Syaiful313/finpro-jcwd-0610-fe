"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface Employee {
  id: number;
  npwp: string;
  role: string; // Role from User table (OUTLET_ADMIN, WORKER, DRIVER)
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  outlet: {
    id: number;
    outletName: string;
  };
}

interface GetEmployeesQueries extends PaginationQueries {
  outletId?: string; // Only for Admin - filter by outlet
  all?: boolean; // Get all without pagination
}

interface UseGetEmployeesOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

const useGetEmployees = (
  queries?: GetEmployeesQueries,
  options?: UseGetEmployeesOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/employees`;
  const queryKey = ["employees", queries];
  const defaultQueries = {
    take: 10,
    page: 1,
    sortBy: "user.firstName",
    sortOrder: "asc" as const,
    ...queries,
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<PageableResponse<Employee>>(
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
    staleTime: options?.staleTime || 10 * 60 * 1000, // 10 minutes for employee data
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetEmployees;
export type { GetEmployeesQueries, UseGetEmployeesOptions, Employee };