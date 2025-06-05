import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ForgotPasswordPayload {
  email: string;
}

export const useForgotPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
        const { data } = await axiosInstance.post("/auth/forgot-password", payload);
        return data;
    },
    onSuccess: () => {
        toast.success('Please check your email to reset password.');
        router.push('/login');
    },
    onError: (error: any) => {
        const message = error?.response?.data?.message || 'Something went wrong';
        toast.error(message);
    }
  });
};

export default useForgotPassword;