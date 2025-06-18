import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { OrderWorkProcess } from "@/types/workerResponse";
import { useQuery } from "@tanstack/react-query";

interface WorkerHistoryProps extends PaginationQueries {
  dateFrom?: string;
  dateTo?: string;
  workerType?: "washing" | "ironing" | "packing" | "all";
}
const useGetWorkerHistory = (queries?: WorkerHistoryProps) => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ["WorkerHistory", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<OrderWorkProcess>
      >("/worker/history", {
        params: queries,
      });
      return data;
    },
  });
};
export default useGetWorkerHistory;
