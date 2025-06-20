import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ResendEmailVerifPayload {
  email: string;
}

const useResendEmailVerif = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ResendEmailVerifPayload) => {
      const { data } = await axiosInstance.post("/auth/reverify", payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Please check your email to verify');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  });
};

export default useResendEmailVerif;