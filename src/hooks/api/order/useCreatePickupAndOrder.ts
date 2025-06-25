import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PayloadCreatePickupAndOrder {
  addressId: number;
  scheduledPickupTime: Date;
}

const useCreatePickupAndOrder = (userId: number) => {
  const axiosInstance = useAxios();
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: PayloadCreatePickupAndOrder) => {
      const { data } = await axiosInstance.post(`/orders`, payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Order created successfully!");
      router.push("/user/profile");
    },
    onError: (error: AxiosError) => {
      toast.error((error.response?.data as { message: string })?.message);
      console.error("Create order error", error);
    },
  });
};

export default useCreatePickupAndOrder;
