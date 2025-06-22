import useAxios from "@/hooks/useAxios";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface useStartOrderProcessProps {
  orderId: string;
  items: {
    laundryItemId: number;
    quantity: number;
  }[];
}
const useStartOrderProcess = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: useStartOrderProcessProps) => {
      const { orderId, items } = body;
      const { data } = await axiosInstance.post(
        `/worker/orders/${orderId}/start`,
        { items },
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["WorkerOrderDetails"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
export default useStartOrderProcess;
