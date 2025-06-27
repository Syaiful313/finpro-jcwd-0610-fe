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
  bypassProcess: BypassProcess;
  createdAt: string;
  updatedAt: string;
  approvedByEmployee: Employee | null;
  orderWorkProcesses: OrderWorkProcess[];
}

export enum BypassProcess {
  IN_PROGRESS = "IN_PROGRESS",
  RE_VERIFY = "RE_VERIFY",
  COMPLETED = "COMPLETED",
}
