import useAxios from "@/hooks/useAxios";
import { NotificationResponse } from "@/types/DriverNotification";
import { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface UseGetWorkerNotificationOptions {
  enabled?: boolean;
  session?: any;
}

const useGetWorkerNotification = (
  options: UseGetWorkerNotificationOptions = {},
) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["worker-notifications"],
    enabled: options.enabled !== undefined ? options.enabled : true,
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<PageableResponse<NotificationResponse>>(
          `/notification/worker`,
        );
      return data;
    },

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useGetWorkerNotification;
