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
    queryFn: async () => {
      const { data } = await axiosInstance.get<LaundryItemResponse>(
        "/orders/laundry-items",
      );
      
      console.log('Hook response:', data); // Debug log
      
      // Response format: { success: true, message: "...", data: [...] }
      return data.data; // Return array langsung
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};

export default useGetLaundryItems;
export type { LaundryItem };