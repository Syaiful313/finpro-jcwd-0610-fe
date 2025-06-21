import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMarkAllAsRead = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post(`/notification/read-all`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["worker-notifications"] });
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
    },
  });
};
export default useMarkAllAsRead;
