// hooks/useGetNotifications.ts

import useAxios from "@/hooks/useAxios";
import { DriverNotification } from "@/types/DriverNotification";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetNotificationsProps extends PaginationQueries {
  isRead?: boolean;
  role?: string;
}

const useGetNotifications = (queries?: GetNotificationsProps) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["notifications", queries],
    enabled: sessionStatus === "authenticated" && !!session,

    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<DriverNotification>
      >(`/notification/driver`, {
        params: {
          ...queries,
        },
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for real-time feel
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchOnMount: true, // Always refetch on mount for notifications
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // Poll every 30 seconds for new notifications
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetNotifications;
