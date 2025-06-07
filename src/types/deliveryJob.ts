import { Employee } from "./employee";
import { DriverTaskStatus } from "./enum";
import { Outlet } from "./outlet";

export interface DeliveryJob {
  id: number;
  employeeId: number;
  employee: Employee[];
  orderId: string;
  outlet: Outlet[];
  deliveryPhotos?: string;
  notes?: string;
  status: DriverTaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
