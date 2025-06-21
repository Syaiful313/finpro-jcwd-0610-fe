import useAxios from "@/hooks/useAxios";
import { ActiveJobs } from "@/types/activeJobs";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface useGetDriverJobsProps extends PaginationQueries {
  status?: "active" | "completed" | "all";
  jobType?: "pickup" | "delivery" | "all";
  dateFrom?: string;
  dateTo?: string;
}

const useGetDriverJobs = (queries?: useGetDriverJobsProps) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["driverJobs", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<ActiveJobs>>(
        `/driver`,
        {
          params: {
            ...queries,
          },
        },
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

export default useGetDriverJobs;
