"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
}

interface LaundryItemResponse {
  success: boolean;
  message: string;
  data: LaundryItem[];
}

const useGetLaundryItems = () => {
  return useQuery({
    queryKey: ["laundry-items"],
    queryFn: async (): Promise<LaundryItem[]> => {
      const { data } = await axiosInstance.get<LaundryItemResponse>(
        "/orders/laundry-items",
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch laundry items");
      }

      return data.data;
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetLaundryItems;
export type { LaundryItem };
