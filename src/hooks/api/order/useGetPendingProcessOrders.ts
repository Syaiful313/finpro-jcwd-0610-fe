"use client";

import useAxios from "@/hooks/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

interface PendingProcessOrder {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  address: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  customerCoordinates?: {
    latitude: number;
    longitude: number;
  };
  outlet: {
    id: number;
    outletName: string;
    latitude: number;
    longitude: number;
    deliveryBaseFee: number;
    deliveryPerKm: number;
    serviceRadius: number;
  };
  pickupInfo?: {
    driver?: string;
    driverPhone?: string;
    scheduledOutlet?: string;
    notes?: string;
    completedAt: string;
  };
}

interface GetPendingProcessOrdersQueries extends PaginationQueries {
  search?: string;
  customerName?: string;
}

const useGetPendingProcessOrders = (
  queries?: GetPendingProcessOrdersQueries,
) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: ["pending-process-orders", queries],
    queryFn: async (): Promise<PageableResponse<PendingProcessOrder>> => {
      const { data } = await axiosInstance.get("/orders/pending/process", {
        params: {
          take: 10,
          page: 1,
          sortBy: "createdAt",
          sortOrder: "asc",
          ...queries,
        },
      });

      if (!data.success) {
        throw new Error(
          data.message || "Failed to fetch pending process orders",
        );
      }

      return {
        data: data.data,
        meta: {
          page: data.meta.page,
          take: data.meta.perPage,
          total: data.meta.total,
          hasNext: data.meta.hasNext,
          hasPrevious: data.meta.hasPrevious,
        },
      };
    },
  });
};

export default useGetPendingProcessOrders;
export type { GetPendingProcessOrdersQueries, PendingProcessOrder };
