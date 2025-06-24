"use client";

import { axiosInstance } from "@/lib/axios";
import { BypassRequest } from "@/types/bypass";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetBypassRequestsQueries extends PaginationQueries {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  workerType?: "WASHING" | "IRONING" | "PACKING";
}

const useGetBypassRequests = (queries?: GetBypassRequestsQueries) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["bypass-requests", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<BypassRequest>>(
        "/bypass-requests",
        { params: queries },
      );
      return data;
    },
    enabled: !!session && session.user?.role === "OUTLET_ADMIN",
  });
};

export default useGetBypassRequests;
