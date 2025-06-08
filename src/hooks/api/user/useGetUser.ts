import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

export const useGetUser = (userId: number) => {
  return useMutation<User, Error, number>({
    mutationFn: async () => {
        const session = await getSession();
        const token = session?.user.accessToken;
        if (!token) throw new Error("No auth token found");
        const { data } = await axiosInstance.get(`/user/${userId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        return data;
    },
    onSuccess: async (data) => {
      toast.success("User data fetched successfully!");
      console.log("Fetched user data:", data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Get user error", error);
    },
  });
};

export default useGetUser;