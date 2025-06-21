import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSetPassword = (token: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (password: string) => {
      const { data } = await axiosInstance.post(
        "/auth/verify-email-and-set-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Password set successfully! You can now log in");
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set password. Please try again.");
      console.error("Set password error:", error);
    }
  });
};

export default useSetPassword;