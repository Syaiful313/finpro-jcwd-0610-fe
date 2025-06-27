import useAxios from "@/hooks/useAxios";
import { DeliveryJob } from "@/types/deliveryJob";
import { PickUpJob } from "@/types/pickUpJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Payload {
  notes: string;
  deliveryPhotos: File | null;
}

const useCompleteDelivery = (deliveryJobId: number) => {
  const axiosInstance = useAxios();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { notes, deliveryPhotos } = payload;
      const completeDelivery = new FormData();

      if (notes) completeDelivery.append("notes", notes);
      if (deliveryPhotos)
        completeDelivery.append("deliveryPhotos", deliveryPhotos);
      const { data } = await axiosInstance.post(
        `/driver/complete-delivery/${deliveryJobId}`,
        completeDelivery,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Delivery job completed successfully!");
      await queryClient.invalidateQueries({ queryKey: ["deliveryJobs"] });
      queryClient.invalidateQueries({ queryKey: ["driverJobs"] });
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data.message);
    },
  });
};
export default useCompleteDelivery;
