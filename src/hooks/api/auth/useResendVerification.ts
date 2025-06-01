import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useResendVerification = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: Pick<User, "email" | "password">) => {
        const { data } = await axiosInstance.post("/resend-verification", payload);
        return data;
    },
    onSuccess: async (data) => {
        toast.success('Verification email resent successfully!');
        router.push("/register/email-verification");
    },
    onError: (error) => {
        toast.error(error.message || 'Error resending verification email.');
        console.error("Login error", error)
    }
  });
};

export default useResendVerification;