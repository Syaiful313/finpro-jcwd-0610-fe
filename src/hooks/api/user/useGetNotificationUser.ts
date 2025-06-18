import useAxios from "@/hooks/useAxios";
import { Notification } from "@/types/notification";
import { PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetNotificationsProps extends PaginationQueries {
  isRead?: boolean;
  role?: string;
  limit?: number;
}

const useGetNotificationUser = (queries?: GetNotificationsProps) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["notifications", queries],
    enabled: sessionStatus === "authenticated" && !!session,

    queryFn: async () => {
      const { data } = await axiosInstance.get<Notification[]>(`/notification/user`, {
        params: {
          ...queries,
          _: Date.now(),
        },
      });
      return data;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetNotificationUser;
