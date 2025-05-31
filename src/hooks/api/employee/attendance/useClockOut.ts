import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { de } from "date-fns/locale";

const useClockOut = () => {
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/attendance/clock-Out");
      return data;
    },
  });
};
export default useClockOut;
