import { Employee } from "./employee";

export interface Attendance {
  id: number;
  employeeId: number;
  employee: Employee;
  outletId: number;
  clockInAt?: string | null;
  clockOutAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
