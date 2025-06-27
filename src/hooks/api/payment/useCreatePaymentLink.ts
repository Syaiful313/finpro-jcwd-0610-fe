import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface useCreatePaymentLinkPayload {
  uuid: string;
}

const useCreatePaymentLink = () => {
  const axiosInstance = useAxios();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: useCreatePaymentLinkPayload) => {
      const { data } = await axiosInstance.post(`/payment`, payload);
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Payment link created");
      router.push(data?.updatedOrder?.invoiceUrl);
      queryClient.invalidateQueries({ queryKey: ["driver-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["worker-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail"] });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Create payment link error", error);
    },
  });
};

export default useCreatePaymentLink;
