// src/hooks/api/bypass/useGetBypassRequestDetail.ts
"use client";

import { axiosInstance } from "@/lib/axios";
import { BypassRequestDetail } from "@/types/bypass";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useGetBypassRequestDetail = (id: number) => {
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ["bypass-requests", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{
        success: boolean;
        message: string;
        data: BypassRequestDetail;
      }>(`/bypass-requests/${id}`);
      return data;
    },
    enabled: !!id && id > 0 && !!session && session.user?.role === "OUTLET_ADMIN", // ONLY OUTLET_ADMIN
  });
};

export default useGetBypassRequestDetail;
