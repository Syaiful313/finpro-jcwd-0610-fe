import useAxios from "@/hooks/useAxios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateUser = (userId: number) => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (payload: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>>) => {
        const { data } = await axiosInstance.patch(`/user/${userId}`, payload);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("User data updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Update user error", error);
    },
  });
};

export default useUpdateUser;