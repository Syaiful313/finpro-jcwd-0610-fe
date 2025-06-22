import { DriverTaskStatus, OrderStatus } from "@/types/enum";

export const getStatusColor = (status: DriverTaskStatus | OrderStatus) => {
  switch (status) {
    case DriverTaskStatus.PENDING:
    case OrderStatus.WAITING_FOR_PICKUP:
      return "bg-orange-500";
    case DriverTaskStatus.ASSIGNED:
    case OrderStatus.DRIVER_ON_THE_WAY_TO_CUSTOMER:
      return "bg-blue-500";
    case DriverTaskStatus.IN_PROGRESS:
    case OrderStatus.ARRIVED_AT_CUSTOMER:
    case OrderStatus.BEING_DELIVERED_TO_CUSTOMER:
      return "bg-primary";
    case DriverTaskStatus.COMPLETED:
    case OrderStatus.COMPLETED:
    case OrderStatus.DELIVERED_TO_CUSTOMER:
      return "bg-gray-500";
    case DriverTaskStatus.CANCELLED:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusText = (status: DriverTaskStatus | OrderStatus) => {
  switch (status) {
    case DriverTaskStatus.PENDING:
      return "Pending";
    case DriverTaskStatus.ASSIGNED:
      return "Assigned";
    case DriverTaskStatus.IN_PROGRESS:
      return "In Progress";
    case DriverTaskStatus.COMPLETED:
      return "Completed";
    case DriverTaskStatus.CANCELLED:
      return "Cancelled";
    case OrderStatus.WAITING_FOR_PICKUP:
      return "Waiting for Pickup";
    case OrderStatus.DRIVER_ON_THE_WAY_TO_CUSTOMER:
      return "Driver on the Way";
    case OrderStatus.ARRIVED_AT_CUSTOMER:
      return "Arrived at Customer";
    case OrderStatus.BEING_DELIVERED_TO_CUSTOMER:
      return "Being Delivered";
    case OrderStatus.DELIVERED_TO_CUSTOMER:
      return "Delivered";
    case OrderStatus.COMPLETED:
      return "Completed";
    default:
      return status.replace(/_/g, " ");
  }
};
