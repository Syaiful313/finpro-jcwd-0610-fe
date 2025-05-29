"use client";

import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  profilePic: string | null;
  isVerified: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  notificationId: string | null;
  totalOrdersInOutlet?: number;
  employeeInfo?: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
}

interface GetUsersQueries extends PaginationQueries {
  search?: string;
  role?: string;
}

interface UseGetUsersOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}
const useGetUsers = (
  outletId?: number,
  queries?: GetUsersQueries,
  options?: UseGetUsersOptions
) => {
  // Conditional endpoint berdasarkan role
  const endpoint = outletId 
    ? `/admin/outlets/${outletId}/users`  // Outlet Admin endpoint
    : `/admin/users`;                     // Super Admin endpoint

  // Conditional queryKey untuk proper caching
  const queryKey = outletId 
    ? ["outlet-users", outletId, queries]  // Cache per outlet
    : ["users", queries];                  // Global cache

  // Default query parameters
  const defaultQueries = {
    take: 10,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
    ...queries
  };

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<User>>(
        endpoint,
        { 
          params: defaultQueries
        }
      );
      return data;
    },
    enabled: options?.enabled !== false && (outletId ? !!outletId : true),
    refetchInterval: options?.refetchInterval,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetUsers;
export type { User, GetUsersQueries, UseGetUsersOptions };