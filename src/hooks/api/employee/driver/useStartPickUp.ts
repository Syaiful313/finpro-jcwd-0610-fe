import useAxios from "@/hooks/useAxios";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useStartPickUp = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pickUpJobId: number) => {
      const { data } = await axiosInstance.post(
        `/drivers/start-pickup/${pickUpJobId}`,
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
      toast.success("Pickup job started successfully!");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useStartPickUp;
