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

const useGetOrders = (queries?: GetOrdersQueries) => {
  return useQuery({
    queryKey: ["orders", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<OrderSummary>>(
        "/orders",
        { params: queries },
      );
      return data;
    },
  });
};

export default useGetOrders;
export type { GetOrdersQueries, OrderSummary as Order };
