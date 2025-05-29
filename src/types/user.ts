export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber: string;
  profilePic?: string;
  isVerified: boolean;
  provider: Provider;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  notificationId?: number;
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
