"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateOutletPayload {
  outletName: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  isActive?: boolean;
}

const useCreateOutlet = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateOutletPayload) => {
      const { data } = await axiosInstance.post("/outlets", {
        outletName: payload.outletName,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        serviceRadius: payload.serviceRadius,
        isActive: payload.isActive ?? true,
      });
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Outlet created successfully");
      await queryClient.invalidateQueries({ queryKey: ["outlets"] });
      router.push("/admin/outlets");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create outlet";
      toast.error(errorMessage);
    },
  });
};

export default useCreateOutlet;