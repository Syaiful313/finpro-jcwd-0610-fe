import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useClaimPickUp = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pickupJobId: number) => {
      const { data } = await axiosInstance.post(
        `/driver/claim-pickup/${pickupJobId}`,
      );
      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["availableRequest"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["driverJobs"],
        exact: false,
      });
      return data;
    },
  });
};
export default useClaimPickUp;
