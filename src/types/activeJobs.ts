export type DriverJobDetailResponse = {
  type: "pickup" | "delivery";
  job: ActiveJobs;
};

export type ActiveJobs = {
  createdAt: string;
  deliveryPhotos: string;
  pickUpPhotos: string;

  employeeId: number;
  id: number;
  jobType: "pickup" | "delivery";
  notes: string | null;
  order: {
    uuid: string;
    actualDeliveryTime: string | null;
    actualPickupTime: string | null;
    addressLine: string;
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
    latitude: number;
    longitude: number;
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      userId: number;
    };
  };
  photos: any[] | null;
  status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  updatedAt: string;
};
