export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export const getOrderStatusConfig = (status: string): StatusConfig => {
  const statusMap: Record<string, StatusConfig> = {
    ARRIVED_AT_OUTLET: {
      label: "Ready to Wash",
      variant: "outline",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    BEING_WASHED: {
      label: "Ready to Iron",
      variant: "outline",
      className: "bg-teal-50 text-teal-700 border-teal-200",
    },
    BEING_IRONED: {
      label: "Ready to Pack",
      variant: "outline",
      className: "bg-purple-50 text-purple-700 border-purple-200",
    },
    BEING_PACKED: {
      label: "Customer Confirm Payment",
      variant: "outline",
      className: "bg-teal-50 text-teal-700 border-teal-200",
    },

    COMPLETED: {
      label: "Completed",
      variant: "outline",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    PICKED_UP: {
      label: "Picked Up",
      variant: "default",
    },
    DELIVERED: {
      label: "Delivered",
      variant: "outline",
      className: "bg-green-50 text-green-700 border-green-200",
    },

    PENDING: {
      label: "Pending",
      variant: "outline",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
    CONFIRMED: {
      label: "Confirmed",
      variant: "secondary",
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "outline",
      className: "bg-orange-50 text-orange-700 border-orange-200",
    },
    WAITING_PAYMENT: {
      label: "Waiting for Payment",
      variant: "outline",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    READY_FOR_DELIVERY: {
      label: "Ready for Delivery",
      variant: "outline",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
  };

  return (
    statusMap[status] || {
      label: status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: "default",
    }
  );
};

export const getStatusColorClass = (status: string): string => {
  const colorMap: Record<string, string> = {
    ARRIVED_AT_OUTLET: "bg-blue-100 text-blue-800 border-blue-300",
    BEING_WASHED: "bg-yellow-100 text-yellow-800 border-yellow-300",
    BEING_IRONED: "bg-purple-100 text-purple-800 border-purple-300",
    COMPLETED: "bg-green-100 text-green-800 border-green-300",
    PICKED_UP: "bg-gray-100 text-gray-800 border-gray-300",
    DELIVERED: "bg-green-100 text-green-800 border-green-300",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800 border-gray-300";
};

export const getBypassStatusConfig = (status: string): StatusConfig => {
  const statusMap: Record<string, StatusConfig> = {
    PENDING: {
      label: "Pending",
      variant: "outline",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    APPROVED: {
      label: "Approved",
      variant: "outline",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    REJECTED: {
      label: "Rejected",
      variant: "destructive",
    },
  };

  return (
    statusMap[status] || {
      label: "Unknown Status",
      variant: "default",
    }
  );
};
