import { NotifType, OrderStatus, Role } from "./enum";

export interface NotificationOrder {
  uuid: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  addressLine: string;
  district: string;
  city: string;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
}

export interface NotificationResponse {
  id: number;
  message: string;
  orderStatus: OrderStatus | null;
  notifType: NotifType;
  role: Role | null;
  isRead: boolean;
  readByUserIds: number[];
  createdAt: string;
  updatedAt: string | null;
  orderId: string | null;
  order: NotificationOrder | null;
}
