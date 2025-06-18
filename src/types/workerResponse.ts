import { BypassRequest } from "./bypass";
import { Employee } from "./employee";
import { OrderStatus, PaymentStatus, WorkerTypes } from "./enum";
import { Order } from "./order";
import { Outlet } from "./outlet";
import { User } from "./user";

export interface WorkerResponse {
  uuid: string;
  userId: number;
  outletId: number;
  outlet: Outlet;
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
  totalDeliveryFee: number | null;
  totalWeight: number | null;
  totalPrice: number | null;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
  orderItems: OrderItem[];
  orderWorkProcess: OrderWorkProcess[];
}

export interface OrderWorkProcess {
  id: number;
  employeeId: number;
  employee: Employee;
  orderId: string;
  order: Order;
  bypassId?: number | null;
  bypass?: BypassRequest | null;
  workerType: WorkerTypes;
  notes?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: Date;
}

interface OrderItem {
  id: number;
  orderId: string;
  laundryItemId: number;
  quantity: number;
  weight: number | null;
  pricePerUnit: number;
  color: string | null;
  brand: string | null;
  materials: string | null;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  laundryItem: LaundryItem;
}

interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
