import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface useFinishBypassProcessProps {
  bypassRequestId: number;
  notes?: string;
  items?: {
    laundryItemId: number;
    quantity: number;
  }[];
}

const useFinishBypassProcess = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: useFinishBypassProcessProps) => {
      const { bypassRequestId, notes, items } = body;
      const { data } = await axiosInstance.post(
        `/worker/orders/complete-bypassed/${bypassRequestId}`,
        { notes, items },
      );
      return data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["WorkerOrderDetails"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["ListOfBypass"],
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
      queryClient.invalidateQueries({
        queryKey: ["bypass-requests"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};

export default useFinishBypassProcess;
