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

const useGetLaundryItems = () => {
  return useQuery({
    queryKey: ["laundry-items"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<LaundryItem[]>(
        "/orders/laundry-items",
      );
      return data;
    },
  });
};

export default useGetLaundryItems;
export type { LaundryItem };
