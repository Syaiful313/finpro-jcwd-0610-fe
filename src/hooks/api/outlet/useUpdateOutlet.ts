"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateOutletPayload {
  outletName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  serviceRadius?: number;
  isActive?: boolean;
}

const useUpdateOutlet = (outletId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateOutletPayload) => {
      const updateData: Record<string, any> = {};

      const addIfExists = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== "") {
          updateData[key] = value;
        }
      };

      addIfExists("outletName", payload.outletName);
      addIfExists("address", payload.address);
      addIfExists("latitude", payload.latitude);
      addIfExists("longitude", payload.longitude);
      addIfExists("serviceRadius", payload.serviceRadius);

      if (payload.isActive !== undefined) {
        updateData.isActive = payload.isActive;
      }

      const { data } = await axiosInstance.patch(
        `/outlets/${outletId}`,
        updateData,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Outlet updated successfully");
      queryClient.invalidateQueries({ queryKey: ["outlets"] });
      queryClient.invalidateQueries({ queryKey: ["outlet", outletId] });
      router.push("/admin/outlets");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update outlet";

      toast.error(errorMessage);
    },
  });
};

export default useUpdateOutlet;
