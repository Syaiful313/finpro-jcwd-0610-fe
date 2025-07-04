import useAxios from "@/hooks/useAxios";
import { ActiveJobs } from "@/types/activeJobs";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface useGetDriverJobsProps extends PaginationQueries {
  status?: "active" | "completed" | "all";
  jobType?: "pickup" | "delivery" | "all";
  dateFrom?: string;
  dateTo?: string;
}

const useGetDriverJobs = (
  queries?: useGetDriverJobsProps,
  options?: UseQueryOptions<
    PageableResponse<ActiveJobs>,
    Error,
    PageableResponse<ActiveJobs>,
    [string, useGetDriverJobsProps?]
  >,
) => {
  const axiosInstance = useAxios();

  return useQuery<
    PageableResponse<ActiveJobs>,
    Error,
    PageableResponse<ActiveJobs>,
    [string, useGetDriverJobsProps?]
  >({
    queryKey: ["driverJobs", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<ActiveJobs>>(
        `/drivers`,
        { params: queries },
      );
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    ...options,
  });
};

export default useGetDriverJobs;
