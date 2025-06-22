"use client";

import { axiosInstance } from "@/lib/axios";
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

interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderSummary[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const useGetOrders = (queries?: GetOrdersQueries) => {
  return useQuery({
    queryKey: ["orders", queries],
    queryFn: async (): Promise<PageableResponse<OrderSummary>> => {
      const { data } = await axiosInstance.get<ApiResponse>("/orders", {
        params: queries,
      });
      return {
        data: data.data,
        meta: {
          page: data.meta.page,
          take: data.meta.perPage,
          total: data.meta.total,
          hasNext: data.meta.hasNext,
          hasPrevious: data.meta.hasPrevious,
        },
      };
    },
  });
};

export default useGetOrders;
export type { GetOrdersQueries, OrderSummary as Order };
