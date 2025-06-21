import useAxios from "@/hooks/useAxios";
import { NotificationResponse } from "@/types/DriverNotification";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface UseGetNotificationsOptions {
  enabled?: boolean;
  session?: any;
}

const useGetDriverNotifications = (
  options: UseGetNotificationsOptions = {},
) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["driver-notifications"],
    enabled: options.enabled !== undefined ? options.enabled : true,

    queryFn: async () => {
      const { data } =
        await axiosInstance.get<PageableResponse<NotificationResponse>>(
          `/notification/driver`,
        );
      return data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetDriverNotifications;
