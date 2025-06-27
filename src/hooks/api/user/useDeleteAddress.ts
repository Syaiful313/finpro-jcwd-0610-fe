import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteAddress = (userId: number) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressId: number) => {
      const { data } = await axiosInstance.delete(`/users/address/${addressId}`);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Address deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Delete address error", error);
    },
  });
};

export default useDeleteAddress;