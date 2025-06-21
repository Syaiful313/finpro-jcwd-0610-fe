import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { RequestList } from "@/types/requestList";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface GetAvailableRequestProps extends PaginationQueries {
  type?: "pickup" | "delivery" | "all";
}
const useGetAvailableRequest = (queries?: GetAvailableRequestProps) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["availableRequest", queries],

    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<RequestList>>(
        `/driver/requests`,
        {
          params: {
            ...queries,
          },
        },
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

export default useGetAvailableRequest;
