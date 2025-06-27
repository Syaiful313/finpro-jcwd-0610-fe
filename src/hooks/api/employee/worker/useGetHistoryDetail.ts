import useAxios from "@/hooks/useAxios";
import { WorkerResponse } from "@/types/workerResponse";
import { useQuery } from "@tanstack/react-query";

const useGetHistoryDetail = (uuid: string) => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ["WorkerHistoryDetail", uuid],
    queryFn: async () => {
      const { data } = await axiosInstance.get<WorkerResponse>(
        `/workers/history/${uuid}`,
      );
      return data;
    },
  });
};
export default useGetHistoryDetail;
