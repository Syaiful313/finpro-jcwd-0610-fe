export interface Order {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  scheduledPickupTime: string | null;
  actualPickupTime: string | null;
  scheduledDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  totalDeliveryFee: number;
  totalWeight: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  outlet: {
    id: number;
    outletName: string;
    address: string;
  };
  address: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  tracking: {
    currentStatus: string;
    currentWorker: {
      id: number;
      name: string;
      workType: string;
      startedAt: string;
    } | null;
    completedProcesses: Array<{
      id: number;
      workerType: string;
      worker: string;
      completedAt: string;
      notes: string | null;
    }>;
    pickupInfo: {
      status: string;
      driver: string;
      photos: string | null;
      notes: string | null;
    } | null;
    deliveryInfo: {
      status: string;
      driver: string;
      photos: string | null;
      notes: string | null;
    } | null;
  };
  items: Array<{
    id: number;
    name: string;
    category: string;
    quantity: number | null;
    weight: number | null;
    pricePerUnit: number;
    totalPrice: number;
    pricingType: string;
  }>;
}
