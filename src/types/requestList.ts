import { Employee } from "./employee";
import { DriverTaskStatus } from "./enum";
import { Order } from "./order";

export interface RequestList {
  id: number;
  employeeId: number;
  employee?: Employee[];
  orderId: string;
  order: Order[];
  orderType: "Pickup" | "Delivery";
  pickUpPhotos?: string;
  deliveryPhotos?: string;
  pickUpScheduleOutlet?: string;
  notes?: string;
  status: DriverTaskStatus;
  createdAt: Date;
  updatedAt?: Date;
  canClaim: boolean;
}
