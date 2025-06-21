import useAxios from "@/hooks/useAxios";
import { axiosInstance } from "@/lib/axios";
import { Attendance } from "@/types/attendance";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetAttendanceProps extends PaginationQueries {
  search?: string;
  employeeId?: number;
  perPage?: number;
  dateFrom?: string;
  dateTo?: string;
}

const useGetAttendance = (queries?: GetAttendanceProps) => {
  console.log("--> useGetAttendance HOOK CALLED with queries:", queries);

  return useQuery({
    queryKey: ["attendance", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Attendance>>(
        "/attendance",
        { params: queries },
      );
      return data;
    },
    staleTime: 8 * 60 * 60 * 1000,
    gcTime: 9 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export default useGetAttendance;
