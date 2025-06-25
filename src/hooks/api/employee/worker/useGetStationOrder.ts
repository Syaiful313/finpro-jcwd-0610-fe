import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { WorkerResponse } from "@/types/workerResponse";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface useGetStationOrderProps extends PaginationQueries {
  status?: "active" | "completed" | "all";
  workerType?: "washing" | "ironing" | "packing" | "all";
  dateFrom?: string;
  dateTo?: string;
}

const useGetStationOrder = (queries?: useGetStationOrderProps) => {
  const axiosInstance = useAxios();
  const { workerType, ...otherQueries } = queries || {};
  return useQuery({
    queryKey: ["WorkerStationOrder", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<WorkerResponse>
      >(`/worker/${workerType || ""}`, {
        params: {
          ...otherQueries,
        },
      });
      return data;
    },
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 13 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

export default useGetStationOrder;
