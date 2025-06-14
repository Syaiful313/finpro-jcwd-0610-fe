import useAxios from "@/hooks/useAxios";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";

const useGetDetailOrder = (uuid: string) => {
  const axiosInstance = useAxios();
  return useQuery<Order>({
    queryKey: ["order-detail", uuid],
    queryFn: async () => {
        const { data } = await axiosInstance.get(`/orders/detail/${uuid}`);
        return data;
    },
    enabled: !!uuid,
  });
};

export default useGetDetailOrder;