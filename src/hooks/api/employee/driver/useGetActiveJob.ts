import useAxios from "@/hooks/useAxios";
import { ActiveJobs } from "@/types/activeJobs";
import { PageableResponse } from "@/types/pagination";
import { RequestList } from "@/types/requestList";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface useGetActiveJobsProps {
  status?: "active" | "completed" | "all";
}

const useGetActiveJobs = (queries?: useGetActiveJobsProps) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();
  return useQuery({
    queryKey: ["activeJobs", queries],
    enabled: sessionStatus === "authenticated" && !!session,
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
export default useGetActiveJobs;
