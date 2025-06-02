import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";

const useClockIn = () => {
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/attendance/clock-in");
      return data;
    },
  });
};

export default useClockIn;
