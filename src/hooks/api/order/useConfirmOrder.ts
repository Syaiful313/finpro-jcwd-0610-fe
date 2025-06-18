import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useConfirmOrder = () => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (uuid: string) => {
        const { data } = await axiosInstance.patch(`/orders/confirm/${uuid}`);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("Order confirmed");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Confirm order error", error);
    },
  });
};

export default useConfirmOrder;