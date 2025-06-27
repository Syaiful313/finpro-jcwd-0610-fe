import useAxios from "@/hooks/useAxios";
import { WorkerResponse } from "@/types/workerResponse";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useGetDetailOrderByUuid = (uuid: string) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["WorkerOrderDetails", uuid],
    queryFn: async () => {
      const { data } = await axiosInstance.get<WorkerResponse>(
        `/workers/orders/${uuid}`,
      );
      return data;
    },
  });
};

export default useGetDetailOrderByUuid;
