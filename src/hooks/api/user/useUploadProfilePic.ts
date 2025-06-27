import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const useUploadProfilePic = (userId: number) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const { update, data: session } = useSession();
  return useMutation({
    mutationFn: async (payload: FormData) => {
        const { data } = await axiosInstance.patch(`/users/photo/${userId}`, payload, {
          headers: {
            'Content-Type': undefined, 
          },
        });
        return data;
    },
    onSuccess: async (data) => {
      toast.success("User data updated successfully!");
      await update({
        ...session,
        user: {
          ...session?.user,
          profilePic: data.profilePic,
        },
      })
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message || "An unexpected error occurred";

      toast.error(errorMessage);
      console.error("Update user error", error);
    },
  });
};

export default useUploadProfilePic;