"use client";

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

interface OrderDetail {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;

  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };

  outlet: {
    id: number;
    outletName: string;
    address?: string;
  };

  deliveryAddress: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };

  schedule: {
    scheduledPickupTime?: string;
    actualPickupTime?: string;
    scheduledDeliveryTime?: string;
    actualDeliveryTime?: string;
  };

  items: Array<{
    id: number;
    laundryItem: {
      id: number;
      name: string;
      category: string;
      pricingType: "PER_PIECE" | "PER_KG";
    };
    quantity?: number;
    weight?: number;
    pricePerUnit: number;
    color?: string;
    brand?: string;
    materials?: string;
    totalPrice: number;
    details: Array<{
      id: number;
      name: string;
      qty: number;
    }>;
    createdAt: string;
  }>;

  pricing: {
    items: number;
    delivery: number;
    total: number;
    breakdown: Array<{
      name: string;
      category: string;
      pricingType: string;
      quantity?: number;
      weight?: number;
      pricePerUnit: number;
      totalPrice: number;
    }>;
  };

  payment: {
    status: string;
    totalAmount: number;
    paidAt?: string;
    breakdown: {
      itemsTotal: number;
      deliveryFee: number;
      grandTotal: number;
    };
    xendit?: {
      xenditId: string;
      invoiceUrl?: string;
      successRedirectUrl?: string;
      expiryDate?: string;
      xenditStatus?: string;
      isExpired: boolean;
    };
    actions: {
      canPay: boolean;
      canRefund: boolean;
      canGenerateNewInvoice: boolean;
    };
    statusInfo: {
      isPaid: boolean;
      isWaitingPayment: boolean;
      isOverdue: boolean;
      paymentMethod?: string;
      timeRemaining?: string;
    };
  };

  delivery: {
    info?: {
      distance: number;
      calculatedFee: number;
      actualFee: number;
      baseFee: number;
      perKmFee: number;
      withinServiceRadius: boolean;
    };
    totalWeight?: number;
    jobs: Array<{
      id: number;
      status: string;
      driver?: string;
      driverPhone?: string;
      photos?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };

  pickup: {
    jobs: Array<{
      id: number;
      status: string;
      driver?: string;
      driverPhone?: string;
      photos: string[];
      scheduledOutlet?: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };

  workProcess: {
    current?: {
      id: number;
      type: string;
      station: string;
      worker?: string;
      workerPhone?: string;
      startedAt: string;
      notes?: string;
      bypass?: any;
    };
    completed: Array<{
      id: number;
      type: string;
      station: string;
      worker?: string;
      workerPhone?: string;
      startedAt: string;
      completedAt: string;
      duration?: string;
      notes?: string;
      bypass?: any;
    }>;
    progress: {
      stages: Array<{
        stage: string;
        label: string;
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
        startedAt?: string;
        completedAt?: string;
        worker?: string;
      }>;
      summary: {
        completed: number;
        inProgress: number;
        pending: number;
        total: number;
        percentage: number;
      };
    };
  };

  timeline: Array<{
    id: string;
    event: string;
    type: string;
    status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
    timestamp: string;
    description: string;
    metadata?: any;
  }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

const useGetOrderDetail = (orderId: string) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async (): Promise<OrderDetail> => {
      try {
        const response = await axiosInstance.get<ApiResponse>(
          `/orders/${orderId}`,
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Failed to fetch order detail",
          );
        }

        const data = response.data.data;
        if (!data) {
          throw new Error("No order data found");
        }

        return data;
      } catch (error: any) {
        console.error("Error fetching order detail:", error);

        if (error.response?.status === 404) {
          throw new Error("Order not found");
        }

        if (error.response?.status === 403) {
          throw new Error("You don't have permission to view this order");
        }

        throw new Error(error.message || "Failed to fetch order detail");
      }
    },
    enabled: !!orderId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 30000,
    gcTime: 300000,
  });
};

export default useGetOrderDetail;
export type { OrderDetail };
