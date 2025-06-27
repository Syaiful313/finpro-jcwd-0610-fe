import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useStartDelivery = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryJobId: number) => {
      const { data } = await axiosInstance.post(
        `/drivers/start-delivery/${deliveryJobId}`,
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["orderDetails"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      toast.success("Delivery job started successfully!");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useStartDelivery;
