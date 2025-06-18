import useAxios from "@/hooks/useAxios";
import { DriverJobResponse } from "@/types/detailApi";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const useGetOrderByUuid = (uuid: string) => {
  const axiosInstance = useAxios();
  const { data: session, status: sessionStatus } = useSession();

  const isEnabled = sessionStatus === "authenticated" && !!session;

  return useQuery({
    queryKey: ["orderDetails", uuid],
    enabled: isEnabled,
    queryFn: async () => {
      const { data } = await axiosInstance.get<DriverJobResponse>(
        `/driver/details/${uuid}`,
      );
      return data;
    },
  });
};
export default useGetOrderByUuid;
