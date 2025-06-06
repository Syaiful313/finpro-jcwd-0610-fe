import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useSetPassword = (token: string) => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (password: string) => {
      console.log("🔐 SENDING DATA");
      console.log("Password:", password);
      console.log("Token:", token);
      console.log("Authorization Header:", `Bearer ${token}`);
      const { data } = await axiosInstance.post(
        "/auth/verify-email-and-set-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`Sending Bearer ${token}`)
      return data;
    },
    onSuccess: () => {
      toast.success("Password set successfully! You can now log in.");
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to set password. Please try again.");
      console.error("Set password error:", error);
    }
  });
};

export default useSetPassword;