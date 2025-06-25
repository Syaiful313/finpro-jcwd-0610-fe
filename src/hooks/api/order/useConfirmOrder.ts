import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useConfirmOrder = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const { data } = await axiosInstance.patch(`/orders/confirm/${uuid}`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Order confirmed");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Confirm order error", error);
    },
  });
};

export default useConfirmOrder;
