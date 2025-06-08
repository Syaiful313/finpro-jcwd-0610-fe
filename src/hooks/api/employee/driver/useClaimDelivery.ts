import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useClaimDelivery = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliveryJobId: number) => {
      const { data } = await axiosInstance.post(
        `/driver/claim-delivery/${deliveryJobId}`,
      );
      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["availableRequest"] });
      return data;
    },
  });
};
export default useClaimDelivery;
