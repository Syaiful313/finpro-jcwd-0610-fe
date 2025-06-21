import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useResetPassword = (token: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { data } = await axiosInstance.post(
        "/auth/reset-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
        toast.success('Password reset successfully. You can now log in');
        router.push('/login');
    },
    onError: (error: any) => {
        const message = error?.response?.data?.message || 'Something went wrong';
        toast.error(message);
    }
  });
};

export default useResetPassword;