"use client";
import useAxios from "@/hooks/useAxios";
import { EmployeePerformanceQueries, EmployeePerformanceResponse } from "@/types/employee-performance";
import { useQuery } from "@tanstack/react-query";

const useGetEmployeePerformance = (queries?: EmployeePerformanceQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["employee-performance", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EmployeePerformanceResponse>(
        "/employee-performances",
        { params: queries }
      );
      return data;
    },
  });
};

export default useGetEmployeePerformance;
