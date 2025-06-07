import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useClockOut = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/attendance/clock-Out");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["claimed-requests"] });

      queryClient.setQueryData(["attendance", undefined], (oldData: any) => {
        if (!oldData) return { data: [data], meta: {} };

        return {
          ...oldData,
          data: [data, ...oldData.data.slice(1)],
        };
      });
    },
  });
};
export default useClockOut;
