import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface useFinishOrderProps {
  orderId: string;
  notes?: string;
}

const useFinishOrderProcess = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: useFinishOrderProps) => {
      const { orderId, notes } = body;
      const { data } = await axiosInstance.post(
        `/workers/orders/${orderId}/finish`,
        { notes },
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["WorkerOrderDetails"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["WorkerStationOrder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["worker-notifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useFinishOrderProcess;
