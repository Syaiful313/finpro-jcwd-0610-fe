import { OrderStatus, PaymentStatus } from "./enum";
import { Outlet } from "./outlet";
import { User } from "./user";

export interface Order {
  uuid: string;
  userId: number;
  user: User[];
  outletId: number;
  outlet: Outlet[];
  notificationId?: number;
  address_line: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
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
