"use client";
import { axiosInstance } from "@/lib/axios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

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
    outletId: number;  
    createdAt: string;
    outlet?: {         
      id: number;
      outletName: string;
      address: string;
    };
  } | null;
}

interface GetUsersQueries extends PaginationQueries {
  search?: string;
  role?: "ADMIN" | "OUTLET_ADMIN" | "CUSTOMER" | "WORKER" | "DRIVER";
}

interface GetUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    hasNext: boolean;
    hasPrevious: boolean;
    page: number;
    perPage: number;
    total: number;
  };
}

const useGetUsers = (
  queries?: GetUsersQueries,
  options?: Omit<
    UseQueryOptions<PageableResponse<User>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["users", queries],
    queryFn: async () => {
      const { data: response } = await axiosInstance.get<GetUsersResponse>(
        "/admin/users",
        { params: queries },
      );

      const { perPage, ...restMeta } = response.meta;
      return {
        data: response.data,
        meta: {
          ...restMeta,
          take: perPage,
        },
      } as PageableResponse<User>;
    },
    ...options,
  });
};

export default useGetUsers;
export type { GetUsersQueries, User };
