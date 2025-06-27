"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useDeleteOutlet = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (outletId: number) => {
      const { data } = await axiosInstance.delete(`/outlets/${outletId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Outlet deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      router.push("/admin/outlets");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || error.response?.data);
    },
  });
};

export default useDeleteOutlet;