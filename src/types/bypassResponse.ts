import { Employee } from "./employee";
import { BypassStatus } from "./enum";
import { Order } from "./order";
import { OrderWorkProcess } from "./workerResponse";

export interface BypassResponse {
  id: number;
  approvedBy: number | null;
  reason: string;
  adminNote: string | null;
  bypassStatus: BypassStatus;
  createdAt: string;
  updatedAt: string;
  approvedByEmployee: Employee | null;
  orderWorkProcesses: OrderWorkProcess[];
}
