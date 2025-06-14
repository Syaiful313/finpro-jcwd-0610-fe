import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteAddress = () => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (addressId: number) => {
      const { data } = await axiosInstance.delete(`/user/address/${addressId}`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Address deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Delete address error", error);
    },
  });
};

export default useDeleteAddress;