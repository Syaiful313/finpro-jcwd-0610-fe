import useAxios from "@/hooks/useAxios";
import { Attendance } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

const useGetTodayAttendance = () => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  const today = format(new Date(), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["attendance", "today", today],
    enabled: sessionStatus === "authenticated" && !!session,
    queryFn: async () => {
      const { data } = await axiosInstance.get<{
        data: Attendance[];
        meta: any;
      }>("/attendance", {
        params: {
          startDate: today,
          endDate: today,
          take: 1,
          page: 1,
          all: false,
        },
      });
      return data;
    },
    staleTime: 10 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
  });
};

export default useGetTodayAttendance;
