// hooks/api/sales-report/useGetSalesReport.ts
"use client";
import useAxios from "@/hooks/useAxios";
import { SalesReportQueries, SalesReportResponse } from "@/types/sales-report";
import { useQuery } from "@tanstack/react-query";

const useGetSalesReport = (queries?: SalesReportQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["sales-report", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<SalesReportResponse>(
        "/reports/sales-report",
        { params: queries }
      );
      return data;
    },
  });
};

export default useGetSalesReport;