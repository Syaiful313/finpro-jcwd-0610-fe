"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateLaundryItemPayload {
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
  isActive?: boolean;
}

const useCreateLaundryItem = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async (payload: CreateLaundryItemPayload) => {
      const { data } = await axiosInstance.post("/laundry-item", {
        name: payload.name,
        category: payload.category,
        basePrice: payload.basePrice,
        pricingType: payload.pricingType,
        isActive: payload.isActive ?? true,
      });
      return data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Item laundry berhasil dibuat");
      await queryClient.invalidateQueries({ queryKey: ["laundryItems"] });
      router.push("/admin/items");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat item laundry";
      toast.error(errorMessage);
    },
  });
};

export default useCreateLaundryItem;