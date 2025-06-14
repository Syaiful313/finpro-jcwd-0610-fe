import { motion } from "framer-motion";
import {
  Truck,
  ShowerHead,
  Package,
  CheckCircle2,
} from "lucide-react";

const CONDENSED_STEPS = [
  { key: "PICKUP", label: "Pickup", icon: Truck },
  { key: "PROCESSING", label: "Processing", icon: ShowerHead },
  { key: "DELIVERY", label: "Delivery", icon: Package },
  { key: "COMPLETED", label: "Completed", icon: CheckCircle2 },
];

const STATUS_TO_STEP: { [key: string]: string } = {
  WAITING_FOR_PICKUP: "PICKUP",
  DRIVER_ON_THE_WAY_TO_CUSTOMER: "PICKUP",
  ARRIVED_AT_CUSTOMER: "PICKUP",
  DRIVER_ON_THE_WAY_TO_OUTLET: "PROCESSING",
  ARRIVED_AT_OUTLET: "PROCESSING",
  BEING_WASHED: "PROCESSING",
  BEING_IRONED: "PROCESSING",
  BEING_PACKED: "PROCESSING",
  WAITING_PAYMENT: "DELIVERY",
  READY_FOR_DELIVERY: "DELIVERY",
  BEING_DELIVERED_TO_CUSTOMER: "DELIVERY",
  DELIVERED_TO_CUSTOMER: "COMPLETED",
  IN_RESOLUTION: "COMPLETED",
  COMPLETED: "COMPLETED",
};

export default function OrderProgressBar({ orderStatus }: { orderStatus: string }) {
  const currentKey = STATUS_TO_STEP[orderStatus] || "PICKUP";
  const currentStepIndex = CONDENSED_STEPS.findIndex((step) => step.key === currentKey);

  return (
    <div className="mb-12 max-w-full overflow-x-auto">
      <p className="text-sm text-gray-500 mb-4 text-center">Order Status</p>
      <div className="flex items-center justify-between relative gap-2">
        {CONDENSED_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex-1 min-w-[60px] text-center relative group">
              {index !== 0 && (
                <motion.div
                  className="absolute top-5 left-0 w-1/2 h-1 bg-gray-300 z-0"
                  initial={{ width: 0 }}
                  animate={{
                    width: isCompleted ? "50%" : "0%",
                    backgroundColor: isCompleted ? "#2563eb" : "#d1d5db",
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              )}

              {index !== CONDENSED_STEPS.length - 1 && (
                <motion.div
                  className="absolute top-5 right-0 w-1/2 h-1 bg-gray-300 z-0"
                  initial={{ width: 0 }}
                  animate={{
                    width: index < currentStepIndex ? "50%" : "0%",
                    backgroundColor: index < currentStepIndex ? "#2563eb" : "#d1d5db",
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              )}

              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  opacity: isCompleted ? 1 : 0.4,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full border-2 mx-auto ${
                  isCompleted
                    ? "bg-blue-100 border-blue-600 text-blue-600"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                <Icon size={20} />
              </motion.div>

              <p
                className={`text-[11px] mt-2 whitespace-nowrap ${
                  isCompleted ? "text-blue-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
