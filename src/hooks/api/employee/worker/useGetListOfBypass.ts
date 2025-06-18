import useAxios from "@/hooks/useAxios";
import { BypassResponse } from "@/types/bypassResponse";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface BypassProps extends PaginationQueries {
  status?: "pending" | "approved" | "rejected";
  dateFrom?: string;
  dateTo?: string;
  includeCompleted?: boolean;
}

const useGetListOfBypass = (queries?: BypassProps) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["ListOfBypass", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<BypassResponse>
      >("/worker/bypass-requests", {
        params: {
          ...queries,
          ...(queries?.status === "approved" &&
            queries?.includeCompleted !== true && {
              completedAt: null,
            }),
        },
      });
      return data;
    },
  });
};
export default useGetListOfBypass;
