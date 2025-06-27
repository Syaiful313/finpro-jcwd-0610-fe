import useAxios from "@/hooks/useAxios";
import { PickUpJob } from "@/types/pickUpJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Payload {
  notes: string;
  pickUpPhotos: File | null;
}

const useCompletePickUp = (pickUpJobId: number) => {
  const axiosInstance = useAxios();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { notes, pickUpPhotos } = payload;
      const completePickUp = new FormData();

      if (notes) completePickUp.append("notes", notes);
      if (pickUpPhotos) completePickUp.append("pickUpPhotos", pickUpPhotos);

      const { data } = await axiosInstance.post(
        `/drivers/complete-pickup/${pickUpJobId}`,
        completePickUp,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Pickup job completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["pickUpJobs"] });
      queryClient.invalidateQueries({ queryKey: ["driverJobs"] });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      router.push("/employee");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useCompletePickUp;
