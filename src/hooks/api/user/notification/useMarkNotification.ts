import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useMarkAllNotif = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.patch(`/notification/read`);
      return data;
    },
    onSuccess: async () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Delete address error", error);
    },
  });
};

export default useMarkAllNotif;