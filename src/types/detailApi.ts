import { DriverTaskStatus } from "./enum";

export enum OrderStatus {
  WAITING_FOR_PICKUP = "WAITING_FOR_PICKUP",
  DRIVER_ON_THE_WAY_TO_CUSTOMER = "DRIVER_ON_THE_WAY_TO_CUSTOMER",
  ARRIVED_AT_CUSTOMER = "ARRIVED_AT_CUSTOMER",
  DRIVER_ON_THE_WAY_TO_OUTLET = "DRIVER_ON_THE_WAY_TO_OUTLET",
  ARRIVED_AT_OUTLET = "ARRIVED_AT_OUTLET",
  BEING_WASHED = "BEING_WASHED",
  BEING_IRONED = "BEING_IRONED",
  BEING_PACKED = "BEING_PACKED",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  BEING_DELIVERED_TO_CUSTOMER = "BEING_DELIVERED_TO_CUSTOMER",
  DELIVERED_TO_CUSTOMER = "DELIVERED_TO_CUSTOMER",
  IN_RESOLUTION = "IN_RESOLUTION",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string | null;
  profilePic: string | null;
  isVerified: boolean;
  provider: string;
  outletId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Employee {
  id: number;
  userId: number;
  outletId: number;
  npwp: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
}

export interface Order {
  uuid: string;
  userId: number;
  user: User;
  outletId: number;
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  scheduledPickupTime: string | null;
  actualPickupTime: string | null;
  scheduledDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  totalDeliveryFee: number;
  totalWeight: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  employeeId: number;
  orderId: string;
  pickUpPhotos: string[] | null;
  pickUpScheduleOutlet: string;
  notes: string | null;
  status: DriverTaskStatus;
  updatedAt: string;
  createdAt: string;
  order: Order;
  employee: Employee;
}

export interface DriverJobResponse {
  type: "pickup" | "delivery";
  job: Job;
}

export type FullAddress = {
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
};

// Helper function to format full address
export const formatFullAddress = (order: Order): FullAddress => {
  const fullAddress = `${order.addressLine}, ${order.district}, ${order.city}, ${order.province} ${order.postalCode}`;

  return {
    addressLine: order.addressLine,
    district: order.district,
    city: order.city,
    province: order.province,
    postalCode: order.postalCode,
    fullAddress,
  };
};

// Helper function to get customer name
export const getCustomerName = (job: Job): string => {
  return `${job.order.user.firstName} ${job.order.user.lastName}`.trim();
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date time
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
