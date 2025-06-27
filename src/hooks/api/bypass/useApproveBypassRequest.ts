"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApproveBypassRequestPayload {
  adminNote: string;
}

interface BypassMutationParams {
  id: number;
  payload: ApproveBypassRequestPayload;
}

const useApproveBypassRequest = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async ({ id, payload }: BypassMutationParams) => {
      const { data } = await axiosInstance.patch(
        `/bypass-requests/${id}/approve`,
        payload,
      );
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data?.message || "Bypass request approved successfully");

      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests", "stats"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ListOfBypass"],
      });
      queryClient.invalidateQueries({
        queryKey: ["WorkerOrderDetails"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to approve bypass request",
      );
    },
  });
};

export default useApproveBypassRequest;
