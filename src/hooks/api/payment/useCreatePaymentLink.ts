import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface useCreatePaymentLinkPayload {
  uuid: string;
}

const useCreatePaymentLink = () => {
  const axiosInstance = useAxios();
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: useCreatePaymentLinkPayload) => {
        const { data } = await axiosInstance.post(`/payment`, payload);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("Payment link created");
      router.push(data?.updatedOrder?.invoiceUrl);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Create payment link error", error);
    },
  });
};

export default useCreatePaymentLink;