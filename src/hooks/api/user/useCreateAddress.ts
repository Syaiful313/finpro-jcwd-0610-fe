import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

interface PayloadCreateAddress {
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

const useCreateAddress = (userId: number) => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (payload: PayloadCreateAddress) => {
      const { data } = await axiosInstance.post(
        `/user/address/${userId}`,
        payload,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Address created successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Create address error", error);
    },
  });
};

export default useCreateAddress;
