import useAxios from "@/hooks/useAxios";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
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

export const useCreateAddress = (userId: number) => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (payload: PayloadCreateAddress) => {
        const session = await getSession();
        const token = session?.user.accessToken;
        if (!token) throw new Error("No auth token found");
        const { data } = await axiosInstance.post(`/user/address/${userId}`, payload);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("Address created successfully!");
      console.log("Created address data:", data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Create address error", error);
    },
  });
};

export default useCreateAddress;