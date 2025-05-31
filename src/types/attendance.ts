export interface Attendance {
  id: number;
  employeeId: number;
  outletId: number;
  clockInAt?: string;
  clockOutAt?: string;
  createdAt: string;
  updatedAt: string;
}
