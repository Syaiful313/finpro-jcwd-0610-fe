import { Address } from "./address";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  profilePic?: string;
  isVerified?: boolean;
  provider?: Provider;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  notificationId?: number | null;
  employeeInfo?: {
    id: number;
    npwp: string;
    createdAt: string;
  } | null;
  addresses?: Address[];
}

export enum Role {
  ADMIN = "ADMIN",
  OUTLET_ADMIN = "OUTLET_ADMIN",
  CUSTOMER = "CUSTOMER",
  WORKER = "WORKER",
  DRIVER = "DRIVER",
}

export enum Provider {
  GOOGLE = "GOOGLE",
  CREDENTIAL = "CREDENTIAL",
}

// ini commit
