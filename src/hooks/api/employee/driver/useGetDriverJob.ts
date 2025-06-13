// import useAxios from "@/hooks/useAxios";
// import { ActiveJobs } from "@/types/activeJobs";
// import { PageableResponse, PaginationQueries } from "@/types/pagination";
// import { RequestList } from "@/types/requestList";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { use } from "react";

// interface useGetActiveJobsProps extends PaginationQueries {
//   type?: "active" | "completed" | "all";
// }

// const useGetDriverJobs = (queries?: useGetActiveJobsProps) => {
//   const axiosInstance = useAxios();
//   const { data: session, status: sessionStatus } = useSession();
//   return useQuery({
//     queryKey: ["activeJobs", queries],
//     enabled: sessionStatus === "authenticated" && !!session,
//     queryFn: async () => {
//       const { data } = await axiosInstance.get<PageableResponse<ActiveJobs>>(
//         `/driver`,
//         {
//           params: {
//             ...queries,
//           },
//         },
//       );
//       return data;
//     },
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     refetchOnReconnect: true,
//     retry: 2,
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//   });
// };
// export default useGetDriverJobs;
import useAxios from "@/hooks/useAxios";
import { ActiveJobs } from "@/types/activeJobs";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { RequestList } from "@/types/requestList";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface useGetDriverJobsProps extends PaginationQueries {
  status?: "active" | "completed" | "all";
  jobType?: "pickup" | "delivery" | "all";
  dateFrom?: string;
  dateTo?: string;
}

const useGetDriverJobs = (queries?: useGetDriverJobsProps) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  return useQuery({
    queryKey: ["driverJobs", queries], // Ubah key agar lebih spesifik
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

export default useGetDriverJobs;
