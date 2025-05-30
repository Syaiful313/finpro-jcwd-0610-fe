export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber: number;
  profilePic: string;
  isVerified: boolean;
  provider: Provider;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  notificationId?: number | null;
  employeeInfo?: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
}

export enum Role {
  ADMIN = "ADMIN",
  OUTLET_ADMIN = "OUTLET_ADMIN",
  CUSTOMER = "CUSTOMER",
  WORKER_WASHING = "WORKER_WASHING",
  WORKER_IRONING = "WORKER_IRONING",
  WORKER_PACKING = "WORKER_PACKING",
  DRIVER = "DRIVER",
}

export enum Provider {
  GOOGLE = "GOOGLE",
  CREDENTIAL = "CREDENTIAL",
}
