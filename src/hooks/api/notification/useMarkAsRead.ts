import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMarkAsRead = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      const { data } = await axiosInstance.post(
        `/notification/read/${notificationId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["worker-notifications"] });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
    },
  });
};
export default useMarkAsRead;
