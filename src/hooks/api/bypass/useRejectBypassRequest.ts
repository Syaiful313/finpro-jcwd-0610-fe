"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface RejectBypassRequestPayload {
  adminNote: string;
}

interface BypassMutationParams {
  id: number;
  payload: RejectBypassRequestPayload;
}

const useRejectBypassRequest = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async ({ id, payload }: BypassMutationParams) => {
      const { data } = await axiosInstance.patch(
        `/bypass-requests/${id}/reject`,
        payload,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Bypass request rejected successfully");

      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests", "stats"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to reject bypass request",
      );
    },
  });
};

export default useRejectBypassRequest;
