import useAxios from "@/hooks/useAxios";
import { Attendance } from "@/types/attendance";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetAttendanceProps extends PaginationQueries {
  search?: string;
  employeeId?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
}

const useGetAttendance = (queries?: GetAttendanceProps) => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ["attendance", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Attendance>>(
        "/attendances",
        { params: queries },
      );
      return data;
    },
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 13 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export default useGetAttendance;
