import useAxios from "@/hooks/useAxios";
import { ActiveJobs, DriverJobDetailResponse } from "@/types/activeJobs";
import { useQuery } from "@tanstack/react-query";

type GetDriverJobHistoryDetailParams = {
  jobId: number;
  type: "pickup" | "delivery";
};

const useGetDriverHistoryDetail = ({
  jobId,
  type,
}: GetDriverJobHistoryDetailParams) => {
  const axiosInstance = useAxios();
  return useQuery({
    queryKey: ["driverHistoryDetail", jobId, type],
    queryFn: async () => {
      const { data } = await axiosInstance.get<DriverJobDetailResponse>(
        `/drivers/history/${jobId}/${type}`,
      );
      return data;
    },
  });
};
export default useGetDriverHistoryDetail;
