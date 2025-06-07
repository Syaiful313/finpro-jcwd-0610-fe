import { Outlet } from "@/hooks/api/outlet/useGetOutlets";
import { DriverTaskStatus } from "./enum";

export interface PickUpJob {
  id: number;
  employeeId: number;
  orderId: string;
  outlet: Outlet[];
  pickUpPhotos?: string;
  pickUpScheduleOutlet: string;
  notes?: string;
  status: DriverTaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
