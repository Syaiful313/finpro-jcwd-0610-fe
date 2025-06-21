export interface OrderSummary {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  totalWeight?: number;
  totalPrice?: number;
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
  isActive?: boolean;
}

export interface OrderTracking {
  currentWorker?: CurrentWorker;
  processHistory: ProcessHistory[];
  pickup?: PickupInfo;
  delivery?: DeliveryInfo;
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

export interface OrderDetail {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;

  customer: DetailedCustomer;
  outlet: DetailedOutlet;
  deliveryAddress: CustomerAddress;
  schedule: OrderSchedule;
  items: OrderItem[];
  pricing: OrderPricing;
  payment: PaymentInfo;
  delivery: DeliveryInfo;
  pickup: PickupInfo;
  workProcess: WorkProcessInfo;
  timeline: DetailedTimelineEvent[];
}

export interface DetailedCustomer {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  addresses?: CustomerAddress[];
  primaryAddress?: CustomerAddress;
}

export interface DetailedOutlet {
  id: number;
  outletName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  serviceRadius?: number;
  deliveryBaseFee?: number;
  deliveryPerKm?: number;
  isActive?: boolean;
}

export interface CustomerAddress {
  id?: number;
  addressName?: string;
  fullAddress: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

export interface OrderSchedule {
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
}

export interface OrderItem {
  id: number;
  laundryItem: {
    id: number;
    name: string;
    category: string;
    basePrice?: number;
    pricingType: "PER_PIECE" | "PER_KG";
  };
  quantity?: number;
  weight?: number;
  pricePerUnit: number;
  color?: string;
  brand?: string;
  materials?: string;
  totalPrice: number;
  details: OrderItemDetail[];
  createdAt: string;
}

export interface OrderItemDetail {
  id: number;
  name: string;
  qty: number;
}

export interface OrderPricing {
  items: number;
  delivery: number;
  total: number;
  breakdown: Array<{
    name: string;
    category: string;
    pricingType: string;
    quantity?: number;
    weight?: number;
    pricePerUnit: number;
    totalPrice: number;
  }>;
}

export interface PaymentInfo {
  status: string;
  totalAmount: number;
  paidAt?: string;
  breakdown: {
    itemsTotal: number;
    deliveryFee: number;
    grandTotal: number;
  };
  xendit?: {
    xenditId: string;
    invoiceUrl?: string;
    successRedirectUrl?: string;
    expiryDate?: string;
    xenditStatus?: string;
    isExpired: boolean;
  };
  actions: {
    canPay: boolean;
    canRefund: boolean;
    canGenerateNewInvoice: boolean;
  };
  statusInfo: {
    isPaid: boolean;
    isWaitingPayment: boolean;
    isOverdue: boolean;
    paymentMethod?: string;
    timeRemaining?: string;
  };
}

export interface DeliveryInfo {
  info?: {
    distance: number;
    calculatedFee: number;
    actualFee: number;
    baseFee: number;
    perKmFee: number;
    withinServiceRadius: boolean;
  };
  totalWeight?: number;
  jobs: Array<{
    id: number;
    status: string;
    driver?: string;
    driverPhone?: string;
    photos?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface PickupInfo {
  jobs: Array<{
    id: number;
    status: string;
    driver?: string;
    driverPhone?: string;
    photos: string[];
    scheduledOutlet?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface WorkProcessInfo {
  current?: {
    id: number;
    type: string;
    station: string;
    worker?: string;
    workerPhone?: string;
    startedAt: string;
    notes?: string;
    bypass?: BypassInfo;
  };
  completed: Array<{
    id: number;
    type: string;
    station: string;
    worker?: string;
    workerPhone?: string;
    startedAt: string;
    completedAt: string;
    duration?: string;
    notes?: string;
    bypass?: BypassInfo;
  }>;
  progress: {
    stages: Array<{
      stage: string;
      label: string;
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
      startedAt?: string;
      completedAt?: string;
      worker?: string;
    }>;
    summary: {
      completed: number;
      inProgress: number;
      pending: number;
      total: number;
      percentage: number;
    };
  };
}

export interface BypassInfo {
  id: number;
  reason: string;
  adminNote?: string;
  bypassStatus: string;
  createdAt: string;
  updatedAt?: string;
  approvedByEmployee?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface DetailedTimelineEvent {
  id: string;
  event: string;
  type: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  timestamp: string;
  description: string;
  metadata?: any;
}

export interface PendingProcessOrder {
  uuid: string;
  orderNumber: string;
  orderStatus: string;
  scheduledPickupTime?: string;
  actualPickupTime?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  address: {
    fullAddress: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  customerCoordinates?: {
    latitude: number;
    longitude: number;
  };
  outlet: {
    id: number;
    outletName: string;
    latitude: number;
    longitude: number;
    deliveryBaseFee: number;
    deliveryPerKm: number;
    serviceRadius: number;
  };
  pickupInfo?: {
    driver?: string;
    driverPhone?: string;
    scheduledOutlet?: string;
    notes?: string;
    completedAt: string;
  };
}

export interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
}

export interface ProcessOrderItem {
  laundryItemId: number;
  quantity?: number;
  weight?: number;
  color?: string;
  brand?: string;
  materials?: string;
  orderItemDetails?: Array<{
    name: string;
    qty: number;
  }>;
}

export interface ProcessOrderPayload {
  totalWeight: number;
  orderItems: ProcessOrderItem[];
}

export interface ProcessOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    orderNumber: string;
    totalWeight: number;
    laundryItemsTotal: number;
    deliveryFee: number;
    totalPrice: number;
    orderStatus: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Order extends OrderSummary {}
export interface WorkProcess extends WorkProcessInfo {}
export interface PickupJobDetail extends PickupInfo {}
export interface DeliveryJobDetail extends DeliveryInfo {}
