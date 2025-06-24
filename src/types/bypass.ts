export interface BypassRequest {
  id: number;
  reason: string;
  adminNote: string | null;
  bypassStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  approvedByEmployee: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    outlet: {
      outletName: string;
    };
  };
  orderWorkProcesses: Array<{
    id: number;
    workerType: "WASHING" | "IRONING" | "PACKING";
    notes: string | null;
    completedAt: string | null;
    order: {
      uuid: string;
      orderNumber: string;
      orderStatus: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
    employee: {
      id: number;
      user: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

export interface BypassRequestDetail extends BypassRequest {
  approvedByEmployee: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    outlet: {
      outletName: string;
      address: string;
    };
  };
  orderWorkProcesses: Array<{
    id: number;
    workerType: "WASHING" | "IRONING" | "PACKING";
    notes: string | null;
    completedAt: string | null;
    order: {
      uuid: string;
      orderNumber: string;
      orderStatus: string;
      orderItems: Array<{
        id: number;
        quantity: number | null;
        weight: number | null;
        pricePerUnit: number;
        totalPrice: number;
        laundryItem: {
          name: string;
          category: string;
        };
        orderItemDetails: Array<{
          name: string;
          qty: number;
        }>;
      }>;
      user: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
    employee: {
      id: number;
      user: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

export interface BypassRequestStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface ProcessBypassRequestPayload {
  adminNote: string;
}

export interface BypassApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface BypassListResponse extends BypassApiResponse {
  data: BypassRequest[];
  meta: {
    page: number;
    take: number;
    total: number;
    totalPages: number;
  };
}

export enum BypassStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum WorkerType {
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
}

export interface BypassRequestFilters {
  status?: BypassStatus;
  workerType?: WorkerType;
  page?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApproveBypassFormData {
  adminNote: string;
}

export interface RejectBypassFormData {
  adminNote: string;
}
