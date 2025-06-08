import { BypassStatus } from "./enum";

export interface BypassRequest {
  id: number;
  approvedBy: number;
  reason: string;
  adminNote?: string;
  bypassStatus: BypassStatus;
  createdAt: Date;
  updatedAt: Date;
}
