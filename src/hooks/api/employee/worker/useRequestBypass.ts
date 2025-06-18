import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useRequestBypass = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { orderId: string; reason: string }) => {
      const { orderId, reason } = body;
      const { data } = await axiosInstance.post(
        `/worker/orders/${orderId}/request-bypass`,
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
    },
  });
};
export default useRequestBypass;
