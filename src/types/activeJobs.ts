export type ActiveJobs = {
  createdAt: string;
  deliveryPhotos: any[] | null;
  employeeId: number;
  id: number;
  jobType: "pickup" | "delivery";
  notes: string | null;
  order: {
    actualDeliveryTime: string | null;
    actualPickupTime: string | null;
    address_line: string;
    city: string;
    createdAt: string;
    district: string;
    notificationId: number;
    orderNumber: string;
    orderStatus: string;
    outlet: {
      outletName: string;
      outletId: number;
    };
    paymentStatus: string;
    postalCode: string;
    province: string;
    scheduledDeliveryTime: string | null;
    scheduledPickupTime: string | null;
    totalDeliveryFee: number;
    totalPickupFee?: number;
    totalWeight: number;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      userId: number;
      uuid: string;
    };
  };
  photos: any[] | null;
  status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  updatedAt: string;
};
