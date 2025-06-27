import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const useGetTodayAttendance = () => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ["attendanceToday"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/attendances/today");
      return data;
    },
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 13 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export default useGetTodayAttendance;
