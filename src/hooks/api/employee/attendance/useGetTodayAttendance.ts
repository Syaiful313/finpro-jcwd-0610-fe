import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetTodayAttendance = () => {
  return useQuery({
    queryKey: ["attendanceToday"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/attendance/today");
      return data;
    },
    staleTime: 8 * 60 * 60 * 1000,
    gcTime: 9 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export default useGetTodayAttendance;
