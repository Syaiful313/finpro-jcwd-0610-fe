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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceToday"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["claimed-requests"] });
      queryClient.invalidateQueries({ queryKey: ["driverJobs"] });
    },
  });
};
export default useClockOut;
