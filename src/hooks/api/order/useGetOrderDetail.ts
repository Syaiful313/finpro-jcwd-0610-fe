"use client";

import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

interface OrderDetail {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalWeight?: number;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;

  customer?: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };

  address?: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };

  outlet?: {
    id: number;
    outletName: string;
    address: string;
  };

  schedule?: {
    scheduledPickupTime?: string;
    actualPickupTime?: string;
    scheduledDeliveryTime?: string;
    actualDeliveryTime?: string;
  };

  pricing?: {
    items?: { total: number };
    delivery?: { fee: number };
    total: number;
  };

  items?: Array<{
    id: number;
    name: string;
    category: string;
    quantity?: number;
    weight?: number;
    pricePerUnit: number;
    totalPrice: number;
    color?: string;
    brand?: string;
    materials?: string;
    pricingType: "PER_PIECE" | "PER_KG";
    details?: Array<{
      id: number;
      name: string;
      qty: number;
    }>;
  }>;

  workProcesses?: Array<{
    id: number;
    workerType: string;
    worker?: {
      id: number;
      name: string;
    };
    notes?: string;
    completedAt?: string;
    createdAt: string;
    bypass?: any;
  }>;

  pickupInfo?: Array<{
    id: number;
    status: string;
    driver?: {
      id: number;
      name: string;
      phoneNumber?: string;
    };
    photos?: string;
    scheduledOutlet?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>;

  deliveryInfo?: Array<{
    id: number;
    status: string;
    driver?: {
      id: number;
      name: string;
      phoneNumber?: string;
    };
    photos?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

const nullToUndefined = <T>(value: T | null): T | undefined => {
  return value === null ? undefined : value;
};

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

        const rawData = response.data.data;
        if (!rawData) {
          throw new Error("No order data found");
        }

        const transformedData: OrderDetail = {
          uuid: rawData.uuid || orderId,
          orderNumber: rawData.orderNumber || "N/A",
          orderStatus: rawData.orderStatus || "UNKNOWN",
          paymentStatus: rawData.paymentStatus || "UNKNOWN",
          createdAt: rawData.createdAt || new Date().toISOString(),
          updatedAt: rawData.updatedAt || new Date().toISOString(),

          totalWeight: nullToUndefined(rawData.totalWeight),
          totalPrice: nullToUndefined(rawData.totalPrice),

          customer: rawData.customer
            ? {
                id: rawData.customer.id || 0,
                name: rawData.customer.name || "N/A",
                email: rawData.customer.email || "N/A",
                phoneNumber: nullToUndefined(rawData.customer.phoneNumber),
              }
            : undefined,

          address: rawData.address
            ? {
                fullAddress: rawData.address.fullAddress || "",
                district: rawData.address.district || "",
                city: rawData.address.city || "",
                province: rawData.address.province || "",
                postalCode: rawData.address.postalCode || "",
              }
            : undefined,

          outlet: rawData.outlet
            ? {
                id: rawData.outlet.id || 0,
                outletName: rawData.outlet.outletName || "N/A",
                address: rawData.outlet.address || "N/A",
              }
            : undefined,

          schedule: rawData.schedule
            ? {
                scheduledPickupTime: nullToUndefined(
                  rawData.schedule.scheduledPickupTime,
                ),
                actualPickupTime: nullToUndefined(
                  rawData.schedule.actualPickupTime,
                ),
                scheduledDeliveryTime: nullToUndefined(
                  rawData.schedule.scheduledDeliveryTime,
                ),
                actualDeliveryTime: nullToUndefined(
                  rawData.schedule.actualDeliveryTime,
                ),
              }
            : undefined,

          pricing: rawData.pricing,

          items: Array.isArray(rawData.items)
            ? rawData.items.map((item: any) => ({
                ...item,
                quantity: nullToUndefined(item.quantity),
                weight: nullToUndefined(item.weight),
                color: nullToUndefined(item.color),
                brand: nullToUndefined(item.brand),
                materials: nullToUndefined(item.materials),
                details: Array.isArray(item.details) ? item.details : [],
              }))
            : [],

          workProcesses: Array.isArray(rawData.workProcesses)
            ? rawData.workProcesses.map((process: any) => ({
                ...process,
                notes: nullToUndefined(process.notes),
                completedAt: nullToUndefined(process.completedAt),
                worker: process.worker
                  ? {
                      ...process.worker,
                    }
                  : undefined,
              }))
            : [],

          pickupInfo: Array.isArray(rawData.pickupInfo)
            ? rawData.pickupInfo.map((pickup: any) => ({
                ...pickup,
                photos: nullToUndefined(pickup.photos),
                scheduledOutlet: nullToUndefined(pickup.scheduledOutlet),
                notes: nullToUndefined(pickup.notes),
                driver: pickup.driver
                  ? {
                      ...pickup.driver,
                      phoneNumber: nullToUndefined(pickup.driver.phoneNumber),
                    }
                  : undefined,
              }))
            : [],

          deliveryInfo: Array.isArray(rawData.deliveryInfo)
            ? rawData.deliveryInfo.map((delivery: any) => ({
                ...delivery,
                photos: nullToUndefined(delivery.photos),
                notes: nullToUndefined(delivery.notes),
                driver: delivery.driver
                  ? {
                      ...delivery.driver,
                      phoneNumber: nullToUndefined(delivery.driver.phoneNumber),
                    }
                  : undefined,
              }))
            : [],
        };

        return transformedData;
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
