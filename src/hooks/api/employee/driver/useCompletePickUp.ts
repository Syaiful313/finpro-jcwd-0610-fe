import useAxios from "@/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";

const useCompletePickUp = () => {
  const axiosInstance = useAxios();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosInstance.post(
        `/driver/complete-pickup/${id}`,
      );
      return data;
    },
  });
};
export default useCompletePickUp;
