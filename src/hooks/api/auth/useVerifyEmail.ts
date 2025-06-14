import { axiosInstance } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const useVerifyEmail = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await axiosInstance.post("/auth/verify-email", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return data;
    },
    onSuccess: () => {
      toast.success("Your email has been verified.");
      router.push('/user/profile')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set password. Please try again.");
      console.error("Verify email error:", error);
    }
  });
};

export default useVerifyEmail;