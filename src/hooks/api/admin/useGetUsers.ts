"use client";
import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  profilePic: string | null;
  isVerified: boolean;
  provider: string;
  outletId?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  totalOrdersInOutlet?: number;
  employeeInfo?: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
}

interface GetUsersQueries extends PaginationQueries {
  search?: string;
  role?: "ADMIN" | "OUTLET_ADMIN" | "CUSTOMER" | "WORKER" | "DRIVER";
}

interface UseGetUsersOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface GetUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    page: number;
    take: number;
    count: number;
    totalPages: number;
  };
}

const useGetUsers = (
  queries?: GetUsersQueries,
  options?: UseGetUsersOptions,
) => {
  const axiosInstance = useAxios();
  const endpoint = `/admin/users`;
  const queryKey = ["users", queries];
  const defaultQueries = {
    take: 10,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
    ...queries,
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get<GetUsersResponse>(endpoint, {
          params: defaultQueries,
        });

        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format");
        }

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch users");
        }

        const response: PageableResponse<User> = {
          data: data.data,
          meta: {
            page: data.meta.page,
            take: data.meta.take,
            total: data.meta.count,
          },
        };

        return response;
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

export default useGetUsers;
export type { GetUsersQueries, UseGetUsersOptions, User };
