"use client";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.delete(`/admin-super/${id}`);
      return data;
    },
    onSuccess: async () => {
      toast.success("Delete user successfully");
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push("/admin/super/users");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message || "Failed to delete user");
    },
  });
};

export default useDeleteUser;
