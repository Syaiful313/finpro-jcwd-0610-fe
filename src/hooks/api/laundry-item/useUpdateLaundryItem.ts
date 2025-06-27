"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UpdateLaundryItemPayload {
  name?: string;
  category?: string;
  basePrice?: number;
  pricingType?: "PER_PIECE" | "PER_KG";
  isActive?: boolean;
}

const useUpdateLaundryItem = (laundryItemId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: UpdateLaundryItemPayload) => {
      const updateData: Record<string, any> = {};

      const addIfExists = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== "") {
          updateData[key] = value;
        }
      };

      addIfExists("name", payload.name);
      addIfExists("category", payload.category);
      addIfExists("pricingType", payload.pricingType);

      if (payload.pricingType === "PER_KG") {
      } else if (
        payload.pricingType === "PER_PIECE" &&
        payload.basePrice !== undefined
      ) {
        updateData.basePrice = payload.basePrice;
      } else if (
        payload.basePrice !== undefined &&
        payload.pricingType === undefined
      ) {
        updateData.basePrice = payload.basePrice;
      }

      if (payload.isActive !== undefined) {
        updateData.isActive = payload.isActive;
      }

      const { data } = await axiosInstance.patch(
        `/laundry-items/${laundryItemId}`,
        updateData,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Item laundry berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["laundryItems"] });
      queryClient.invalidateQueries({
        queryKey: ["laundryItem", laundryItemId],
      });
      router.push("/admin/items");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal memperbarui item laundry";

      toast.error(errorMessage);
    },
  });
};

export default useUpdateLaundryItem;
