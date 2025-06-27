"use client";

import useAxios from "@/hooks/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderItemDetail {
  name: string;
  qty: number;
}

interface ProcessOrderItem {
  laundryItemId: number;
  quantity?: number;
  weight?: number;
  color?: string;
  brand?: string;
  materials?: string;
  orderItemDetails?: OrderItemDetail[];
}

interface ProcessOrderPayload {
  totalWeight: number;
  orderItems: ProcessOrderItem[];
}

interface ProcessOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    orderNumber: string;
    totalWeight: number;
    laundryItemsTotal: number;
    deliveryFee: number;
    totalPrice: number;
    orderStatus: string;
  };
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

const useProcessOrder = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  return useMutation({
    mutationFn: async ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: ProcessOrderPayload;
    }): Promise<ProcessOrderResponse> => {
      const { data } = await axiosInstance.patch<ProcessOrderResponse>(
        `/orders/${orderId}/process`,
        payload,
      );
      return data;
    },

    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message || "Pesanan berhasil diproses!");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["pending-process-orders"] }),
        queryClient.invalidateQueries({ queryKey: ["order-detail"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["WorkerOrderDetails"] }),
        queryClient.invalidateQueries({ queryKey: ["availableRequest"] }),
        queryClient.invalidateQueries({ queryKey: ["worker-notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["driver-notifications"] }),
      ]);

      router.push("/admin/orders");
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "Gagal memproses pesanan";
      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    },
  });
};

export const cleanPayload = (
  payload: ProcessOrderPayload,
): ProcessOrderPayload => {
  return {
    ...payload,
    orderItems: payload.orderItems.map((item) => ({
      laundryItemId: item.laundryItemId,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : undefined,
      weight: item.weight && item.weight > 0 ? item.weight : undefined,
      color: item.color?.trim() || undefined,
      brand: item.brand?.trim() || undefined,
      materials: item.materials?.trim() || undefined,
      orderItemDetails:
        item.orderItemDetails?.filter(
          (detail) => detail.name.trim() && detail.qty > 0,
        ) || undefined,
    })),
  };
};

export default useProcessOrder;
export type {
  ApiErrorResponse,
  OrderItemDetail,
  ProcessOrderItem,
  ProcessOrderPayload,
  ProcessOrderResponse,
};
