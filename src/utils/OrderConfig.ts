import { Shirt, Sparkles, Box } from "lucide-react";

export type WorkerType = "washing" | "ironing" | "packing";

export const workerConfigs = {
  washing: {
    title: "Washing Station",
    icon: Shirt,
    color: "blue",
  },
  ironing: {
    title: "Ironing Station",
    icon: Sparkles,
    color: "purple",
  },
  packing: {
    title: "Packing Station",
    icon: Box,
    color: "green",
  },
};

export const isValidWorkerType = (type: string | null): type is WorkerType => {
  return type === "washing" || type === "ironing" || type === "packing";
};
