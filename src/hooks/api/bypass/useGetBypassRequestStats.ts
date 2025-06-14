
// src/hooks/api/bypass/useGetBypassRequestStats.ts
"use client";

import { axiosInstance } from "@/lib/axios";
import { BypassRequestStats } from "@/types/bypass";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useGetBypassRequestStats = () => {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ["bypass-requests", "stats"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{
        success: boolean;
        message: string;
        data: BypassRequestStats;
      }>("/bypass-requests/stats");
      return data;
    },
    enabled: !!session && session.user?.role === "OUTLET_ADMIN", // ONLY OUTLET_ADMIN
  });
};

export default useGetBypassRequestStats;
