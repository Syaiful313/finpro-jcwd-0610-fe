import { OrderStatus, PaymentStatus } from "./enum";
import { Outlet } from "./outlet";
import { User } from "./user";

export interface Order {
  uuid: string;
  userId: number;
  user: User;
  outletId: number;
  outlet: Outlet;
  notificationId?: number;
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  scheduledPickupTime?: Date;
  actualPickupTime?: Date;
  scheduledDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  totalDeliveryFee?: number;
  totalWeight?: number;
  totalPrice?: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverOrder extends Order {
  canClaim: boolean;
}
