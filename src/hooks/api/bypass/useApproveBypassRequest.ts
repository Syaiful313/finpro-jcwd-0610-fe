"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ApproveBypassRequestPayload {
  adminNote: string;
}

const useApproveBypassRequest = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: ApproveBypassRequestPayload;
    }) => {
      if (session?.user?.role !== "OUTLET_ADMIN") {
        throw new Error(
          "Access denied. Only outlet admins can approve bypass requests.",
        );
      }

      const { data } = await axiosInstance.post(
        `/bypass-requests/${id}/approve`,
        payload,
      );
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Bypass request approved successfully");

      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["bypass-requests", "stats"],
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
