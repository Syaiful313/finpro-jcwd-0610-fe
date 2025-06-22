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
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/30",
    },
    BEING_WASHED: {
      label: "Ready to Iron",
      variant: "outline",
      className:
        "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-400/30",
    },
    BEING_IRONED: {
      label: "Ready to Pack",
      variant: "outline",
      className:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-400/30",
    },
    BEING_PACKED: {
      label: "Customer Confirm Payment",
      variant: "outline",
      className:
        "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-400/30",
    },
    COMPLETED: {
      label: "Completed",
      variant: "outline",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/30",
    },
    PICKED_UP: {
      label: "Picked Up",
      variant: "default",
    },
    DELIVERED: {
      label: "Delivered",
      variant: "outline",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/30",
    },
    PENDING: {
      label: "Pending",
      variant: "outline",
      className:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-400/30",
    },
    CONFIRMED: {
      label: "Confirmed",
      variant: "secondary",
    },
    IN_PROGRESS: {
      label: "In Progress",
      variant: "outline",
      className:
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-400/30",
    },
    WAITING_PAYMENT: {
      label: "Waiting for Payment",
      variant: "outline",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-400/30",
    },
    READY_FOR_DELIVERY: {
      label: "Ready for Delivery",
      variant: "outline",
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/30",
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
    ARRIVED_AT_OUTLET:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/30",
    BEING_WASHED:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-400/30",
    BEING_IRONED:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-400/30",
    COMPLETED:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/30",
    PICKED_UP:
      "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-400/30",
    DELIVERED:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/30",
  };

  return (
    colorMap[status] ||
    "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-400/30"
  );
};

export const getBypassStatusConfig = (status: string): StatusConfig => {
  const statusMap: Record<string, StatusConfig> = {
    PENDING: {
      label: "Pending",
      variant: "outline",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-400/30",
    },
    APPROVED: {
      label: "Approved",
      variant: "outline",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-400/30",
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
