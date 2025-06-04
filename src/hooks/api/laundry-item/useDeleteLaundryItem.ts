"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useDeleteLaundryItem = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (laundryItemId: number) => {
      const { data } = await axiosInstance.delete(`/laundry-item/${laundryItemId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Item laundry berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["laundryItems"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || error.response?.data);
    },
  });
};

export default useDeleteLaundryItem;