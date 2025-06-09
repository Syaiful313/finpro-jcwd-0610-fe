export interface Order {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  scheduledPickupTime: string | null;
  actualPickupTime: string | null;
  scheduledDeliveryTime: string | null;
  actualDeliveryTime: string | null;
  totalDeliveryFee: number;
  totalWeight: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  outlet: {
    id: number;
    outletName: string;
    address: string;
  };
  address: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  tracking: {
    currentStatus: string;
    currentWorker: {
      id: number;
      name: string;
      workType: string;
      startedAt: string;
    } | null;
    completedProcesses: Array<{
      id: number;
      workerType: string;
      worker: string;
      completedAt: string;
      notes: string | null;
    }>;
    pickupInfo: {
      status: string;
      driver: string;
      photos: string | null;
      notes: string | null;
    } | null;
    deliveryInfo: {
      status: string;
      driver: string;
      photos: string | null;
      notes: string | null;
    } | null;
  };
  items: Array<{
    id: number;
    name: string;
    category: string;
    quantity: number | null;
    weight: number | null;
    pricePerUnit: number;
    totalPrice: number;
    pricingType: string;
  }>;
}

// get orders

export interface OrderSummary {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  totalWeight: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerSummary;
  outlet: OutletSummary;
  tracking: OrderTracking;
}

export interface CustomerSummary {
  id: number;
  name: string;
  email: string;
}

export interface OutletSummary {
  id: number;
  outletName: string;
}

export interface OrderTracking {
  currentWorker: CurrentWorker | null;
  processHistory: ProcessHistory[];
  pickup: PickupInfo | null;
  delivery: DeliveryInfo | null;
  timeline: TimelineEvent[];
}

export interface CurrentWorker {
  id: number;
  name: string;
  workerType: string;
  station: string;
  startedAt: string;
  notes?: string;
  hasBypass: boolean;
}

export interface ProcessHistory {
  station: string;
  worker: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  notes?: string;
  hasBypass: boolean;
}

export interface PickupInfo {
  id: number;
  driver: string;
  status: string;
  assignedAt: string;
  lastUpdate: string;
}

export interface DeliveryInfo {
  id: number;
  driver: string;
  status: string;
  assignedAt: string;
  lastUpdate: string;
}

export interface TimelineEvent {
  event: string;
  timestamp: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  description: string;
  worker?: string;
  notes?: string;
  hasBypass?: boolean;
}

// order detail 

export interface OrderDetail extends OrderSummary {
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
  address: CustomerAddress;
  items: OrderItem[];
  workProcesses: WorkProcess[];
  pickupInfo: PickupJobDetail[];
  deliveryInfo: DeliveryJobDetail[];
}

export interface CustomerAddress {
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity?: number;
  weight?: number;
  pricePerUnit: number;
  totalPrice: number;
  color?: string;
  brand?: string;
  materials?: string;
  pricingType: string;
  details: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  name: string;
  qty: number;
}

export interface WorkProcess {
  id: number;
  workerType: string;
  worker: {
    id: number;
    name: string;
  };
  notes?: string;
  completedAt?: string;
  createdAt: string;
  bypass?: BypassInfo;
}

export interface BypassInfo {
  id: number;
  reason: string;
  adminNote?: string;
  bypassStatus: string;
  createdAt: string;
}

export interface PickupJobDetail {
  id: number;
  status: string;
  driver: {
    id: number;
    name: string;
    phoneNumber?: string;
  };
  photos?: string;
  scheduledOutlet: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryJobDetail {
  id: number;
  status: string;
  driver: {
    id: number;
    name: string;
    phoneNumber?: string;
  };
  photos?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}