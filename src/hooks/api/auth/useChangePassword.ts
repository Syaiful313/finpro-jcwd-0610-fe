import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const useChangePassword = () => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
        const { data } = await axiosInstance.patch("/auth/password", payload);
        return data;
    },
    onSuccess: () => {
        toast.success('Password has been successfully changed');
    },
    onError: (error: any) => {
        const message = error?.response?.data?.message || 'Something went wrong';
        toast.error(message);
        console.error(error)
    }
  });
};

export default useChangePassword