import useAxios from "@/hooks/useAxios";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

interface GetOrdersParams {
  userId: number;
  page: number;
  limit: number;
}

interface PaginatedOrderResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

const useGetOrdersUser = ({ userId, page, limit }: GetOrdersParams) => {
  const axiosInstance = useAxios();
  return useQuery<PaginatedOrderResponse>({
    queryKey: ["orders-user", userId, page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/orders/user/${userId}?page=${page}&limit=${limit}`,
      );

      const { orders, total, page: currentPage } = response.data;

      return {
        data: orders,
        total,
        page: currentPage,
        limit,
      };
    },
    enabled: !!userId && !!page && !!limit,
  });
};

export default useGetOrdersUser;
