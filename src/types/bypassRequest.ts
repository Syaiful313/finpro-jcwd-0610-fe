import { BypassProcess } from "./bypassResponse";
import { BypassStatus } from "./enum";

export interface BypassRequest {
  id: number;
  approvedBy: number;
  reason: string;
  adminNote?: string;
  bypassStatus: BypassStatus;
  bypassProcess: BypassProcess;
  createdAt: Date;
  updatedAt: Date;
}
