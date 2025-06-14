import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
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
        const session = await getSession();
        const token = session?.user.accessToken;
        if (!token) throw new Error("No auth token found");
        const { data } = await axiosInstance.post(`/orders`, payload);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("Order created successfully!");
      router.push('/user/profile')
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Create order error", error);
    },
  });
};

export default useCreatePickupAndOrder;