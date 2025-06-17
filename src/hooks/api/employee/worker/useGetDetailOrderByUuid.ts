import useAxios from "@/hooks/useAxios";
import { WorkerResponse } from "@/types/workerResponse";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useGetDetailOrderByUuid = (uuid: string) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();
  const isEnabled = sessionStatus === "authenticated" && !!session;
  return useQuery({
    queryKey: ["WorkerOrderDetails", uuid],
    enabled: isEnabled,
    queryFn: async () => {
      const { data } = await axiosInstance.get<WorkerResponse>(
        `/worker/orders/${uuid}`,
      );
      return data;
    },
  });
};

export default useGetDetailOrderByUuid;
