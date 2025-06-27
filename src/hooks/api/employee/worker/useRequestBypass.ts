import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useRequestBypass = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { orderId: string; reason: string }) => {
      const { orderId, reason } = body;
      const { data } = await axiosInstance.post(
        `/workers/orders/${orderId}/request-bypass`,
        { reason },
      );
      return data;
    },
    onSuccess: async (_, body) => {
      queryClient.invalidateQueries({
        queryKey: ["WorkerOrderDetails", body.orderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ListOfBypass"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bypass-requests"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useRequestBypass;
