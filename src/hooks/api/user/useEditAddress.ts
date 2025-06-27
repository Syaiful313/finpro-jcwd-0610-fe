import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PayloadEditAddress {
    addressId: number;
    addressName: string;
    addressLine: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
}

const useEditAddress = (userId: number) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PayloadEditAddress) => {
        const { addressId, ...rest } = payload;
        const { data } = await axiosInstance.patch(`/users/address/${addressId}`, payload);
        return data;
    },
    onSuccess: async () => {
      toast.success("Address edited successfully!");      
      queryClient.invalidateQueries({ queryKey: ["user", userId] });

    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Edit address error", error);
    },
  });
};

export default useEditAddress;