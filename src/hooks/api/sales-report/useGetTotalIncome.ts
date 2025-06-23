"use client";
import useAxios from "@/hooks/useAxios";
import { TotalIncomeQueries, TotalIncomeResponse } from "@/types/sales-report";
import { useQuery } from "@tanstack/react-query";

const useGetTotalIncome = (queries?: TotalIncomeQueries) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["total-income", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TotalIncomeResponse>(
        "/reports/total-income",
        { params: queries },
      );
      return data;
    },
  });
};

export default useGetTotalIncome;
