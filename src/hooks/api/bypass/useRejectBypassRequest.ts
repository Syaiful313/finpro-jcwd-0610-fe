// src/hooks/api/bypass/useRejectBypassRequest.ts
"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface RejectBypassRequestPayload {
  adminNote: string;
}

const useRejectBypassRequest = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: RejectBypassRequestPayload;
    }) => {
      // CRITICAL: Only allow outlet admin to reject
      if (session?.user?.role !== "OUTLET_ADMIN") {
        throw new Error(
          "Access denied. Only outlet admins can reject bypass requests.",
        );
      }

      const { data } = await axiosInstance.post(
        `/bypass-requests/${id}/reject`,
        payload,
      );
      return data;
    },
    onSuccess: async (data) => {
      toast.success("Bypass request rejected successfully");

      // Invalidate outlet-specific queries
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
