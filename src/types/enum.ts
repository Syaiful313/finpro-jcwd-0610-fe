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

export enum NotifType {
  NEW_PICKUP_REQUEST = "NEW_PICKUP_REQUEST",
  PICKUP_STARTED = "PICKUP_STARTED",
  PICKUP_COMPLETED = "PICKUP_COMPLETED",
  NEW_DELIVERY_REQUEST = "NEW_DELIVERY_REQUEST",
  DELIVERY_STARTED = "DELIVERY_STARTED",
  DELIVERY_COMPLETED = "DELIVERY_COMPLETED",
  ORDER_STARTED = "ORDER_STARTED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  BYPASS_REQUEST = "BYPASS_REQUEST",
  BYPASS_APPROVED = "BYPASS_APPROVED",
  BYPASS_REJECTED = "BYPASS_REJECTED",
}

export enum DriverTaskStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum WorkerTypes {
  WASHING = "WASHING",
  IRONING = "IRONING",
  PACKING = "PACKING",
}

export enum BypassStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PAID = "PAID",
}

export enum OrderStatus {
  WAITING_FOR_PICKUP = "WAITING_FOR_PICKUP",
  DRIVER_ON_THE_WAY_TO_CUSTOMER = "DRIVER_ON_THE_WAY_TO_CUSTOMER",
  ARRIVED_AT_CUSTOMER = "ARRIVED_AT_CUSTOMER",
  DRIVER_ON_THE_WAY_TO_OUTLET = "DRIVER_ON_THE_WAY_TO_OUTLET",
  ARRIVED_AT_OUTLET = "ARRIVED_AT_OUTLET",
  BEING_WASHED = "BEING_WASHED",
  BEING_IRONED = "BEING_IRONED",
  BEING_PACKED = "BEING_PACKED",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
  BEING_DELIVERED_TO_CUSTOMER = "BEING_DELIVERED_TO_CUSTOMER",
  DELIVERED_TO_CUSTOMER = "DELIVERED_TO_CUSTOMER",
  IN_RESOLUTION = "IN_RESOLUTION",
  COMPLETED = "COMPLETED",
}
