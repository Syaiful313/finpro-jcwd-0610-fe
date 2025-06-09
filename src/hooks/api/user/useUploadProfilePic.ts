import useAxios from "@/hooks/useAxios";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

export const useUploadProfilePic = (userId: number) => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (payload: FormData) => {
        const session = await getSession();
        const token = session?.user.accessToken;
        if (!token) throw new Error("No auth token found");
        const { data } = await axiosInstance.patch(`/user/photo/${userId}`, payload);
        return data;
    },
    onSuccess: async (data) => {
      toast.success("User data updated successfully!");
      console.log("Updated user data:", data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Update user error", error);
    },
  });
};

export default useUploadProfilePic;