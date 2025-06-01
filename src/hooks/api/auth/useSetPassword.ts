import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SetPasswordPayload {
  token: string;
  password: string;
}

export const useSetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (payload: SetPasswordPayload) => {
      const { data } = await axiosInstance.post("/auth/verify-email-and-set-password", payload);
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