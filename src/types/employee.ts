import { Outlet } from "./outlet";
import { User } from "./user";

export interface Employee {
  id: number;
  userId: number;
  user: User;
  outletId: number;
  outlet: Outlet;
  npwp: string;
  createdAt: Date;
  updatedAt: Date;
}
