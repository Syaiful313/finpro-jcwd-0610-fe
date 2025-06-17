// hooks/api/sales-report/useGetOutletComparison.ts
"use client";
import useAxios from "@/hooks/useAxios";
import { OutletComparisonQueries, OutletComparisonResponse } from "@/types/sales-report";
import { useQuery } from "@tanstack/react-query";

const useGetOutletComparison = (queries?: OutletComparisonQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["outlet-comparison", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OutletComparisonResponse>(
        "/reports/outlet-comparison",
        { params: queries }
      );
      return data;
    },
  });
};

export default useGetOutletComparison;