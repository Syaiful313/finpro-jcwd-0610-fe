import { Role } from "./enum";
import { Order } from "./order";

export enum NotifType {
  NEW_PICKUP_REQUEST = "NEW_PICKUP_REQUEST",
  PICKUP_COMPLETED = "PICKUP_COMPLETED",
  NEW_DELIVERY_REQUEST = "NEW_DELIVERY_REQUEST",
  DELIVERY_COMPLETED = "DELIVERY_COMPLETED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  BYPASS_REQUEST = "BYPASS_REQUEST",
  BYPASS_APPROVED = "BYPASS_APPROVED",
  BYPASS_REJECTED = "BYPASS_REJECTED",
}

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

export interface NotificationOrder {
  uuid: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  address_line: string;
  district: string;
  city: string;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
}

export interface DriverNotification {
  id: number;
  message: string;
  orderStatus: OrderStatus | null;
  notifType: NotifType;
  role: Role | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
  orderUuid: string | null;
  order: NotificationOrder | null;
}
