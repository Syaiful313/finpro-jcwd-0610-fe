import { OrderDetail } from "@/hooks/api/order/useGetOrderDetail";
import { CustomerAddressSection } from "./CustomerAddressSection";
import { OrderHeader } from "./OrderHeader";
import { OrderItemsSection } from "./OrderItemsSection";
import { OrderTimeline, StatusHistoryItem } from "./OrderTimeline";
import { PaymentSection } from "./PaymentSection";
import { ProcessingSection } from "./ProcessingSection";

interface OrderDetailContentProps {
  orderDetail: OrderDetail;
}

export function OrderDetailContent({ orderDetail }: OrderDetailContentProps) {
  const safeString = (value?: string): string => value || "N/A";
  const toNullIfUndefined = (value?: string): string | null =>
    value ? value : null;
  const workerToUndefined = (worker?: {
    name: string;
  }): { name: string } | undefined => worker || undefined;
  const workerToNull = (worker?: { name: string }): { name: string } | null =>
    worker || null;

  const generateStatusHistory = (): StatusHistoryItem[] => {
    const history: StatusHistoryItem[] = [];

    history.push({
      status: "WAITING_FOR_PICKUP",
      timestamp: orderDetail.createdAt,
      updatedBy: {
        name: "System",
        role: "system",
      },
      notes: "Order created by customer",
    });

    if (orderDetail.workProcesses) {
      orderDetail.workProcesses.forEach((process) => {
        if (process.workerType === "WASHING") {
          history.push({
            status: "BEING_WASHED",
            timestamp: process.createdAt,
            updatedBy: {
              name: process.worker?.name || "Unknown",
              role: "worker",
            },
            notes: process.notes,
          });

          if (process.completedAt) {
            history.push({
              status: "BEING_WASHED",
              timestamp: process.completedAt,
              updatedBy: {
                name: process.worker?.name || "Unknown",
                role: "worker",
              },
              notes: "Washing completed",
            });
          }
        }

        if (process.workerType === "IRONING") {
          history.push({
            status: "BEING_IRONED",
            timestamp: process.createdAt,
            updatedBy: {
              name: process.worker?.name || "Unknown",
              role: "worker",
            },
            notes: process.notes,
          });

          if (process.completedAt) {
            history.push({
              status: "BEING_IRONED",
              timestamp: process.completedAt,
              updatedBy: {
                name: process.worker?.name || "Unknown",
                role: "worker",
              },
              notes: "Ironing completed",
            });
          }
        }

        if (process.workerType === "PACKING") {
          history.push({
            status: "BEING_PACKED",
            timestamp: process.createdAt,
            updatedBy: {
              name: process.worker?.name || "Unknown",
              role: "worker",
            },
            notes: process.notes,
          });

          if (process.completedAt) {
            history.push({
              status: "BEING_PACKED",
              timestamp: process.completedAt,
              updatedBy: {
                name: process.worker?.name || "Unknown",
                role: "worker",
              },
              notes: "Packing completed",
            });
          }
        }
      });
    }

    return history;
  };

  const transformedOrder = {
    orderNumber: safeString(orderDetail.orderNumber),
    status: safeString(orderDetail.orderStatus),
    createdAt: orderDetail.createdAt,
    outletName: safeString(orderDetail.outlet?.outletName),
    payment: {
      totalAmount: orderDetail.totalPrice || orderDetail.pricing?.total || 0,
      status: orderDetail.paymentStatus === "PAID" ? "Paid" : "Pending",
      method: "Credit Card",
      date: toNullIfUndefined(orderDetail.createdAt),
      transactionId: "TRX" + Math.random().toString(36).substr(2, 9),
    },
    items: (orderDetail.items || []).map((item) => ({
      id: item.id.toString(),
      name: safeString(item.name),
      description:
        `${item.category || ""} ${[item.color, item.brand].filter(Boolean).join(", ")}`.trim(),
      price: item.pricePerUnit || 0,
      quantity: item.quantity || item.weight || 1,
      weight: item.weight || item.quantity || 0,
    })),
    customer: {
      name: safeString(orderDetail.customer?.name),
      phone: safeString(orderDetail.customer?.phoneNumber),
      email: orderDetail.customer?.email,
      verified: true,
    },
    pickupAddress: {
      address: safeString(orderDetail.address?.fullAddress),
      scheduledTime: toNullIfUndefined(
        orderDetail.schedule?.scheduledPickupTime,
      ),
      actualTime: toNullIfUndefined(orderDetail.schedule?.actualPickupTime),
      driver: orderDetail.pickupInfo?.[0]?.driver
        ? {
            name: safeString(orderDetail.pickupInfo[0].driver.name),
          }
        : undefined,
    },
    deliveryAddress: {
      address: safeString(orderDetail.address?.fullAddress),
      scheduledTime: toNullIfUndefined(
        orderDetail.schedule?.scheduledDeliveryTime,
      ),
      actualTime: toNullIfUndefined(orderDetail.schedule?.actualDeliveryTime),
      driver: orderDetail.deliveryInfo?.[0]?.driver
        ? {
            name: safeString(orderDetail.deliveryInfo[0].driver.name),
          }
        : undefined,
    },
    processingInfo: {
      washing: {
        status: getProcessStatus("WASHING", orderDetail.workProcesses || []),
        worker: workerToNull(
          getProcessWorker("WASHING", orderDetail.workProcesses || []),
        ),
        startTime: toNullIfUndefined(
          getProcessTime("WASHING", orderDetail.workProcesses || [], "start"),
        ),
        endTime: toNullIfUndefined(
          getProcessTime("WASHING", orderDetail.workProcesses || [], "end"),
        ),
        notes: toNullIfUndefined(
          getProcessNotes("WASHING", orderDetail.workProcesses || []),
        ),
      },
      ironing: {
        status: getProcessStatus("IRONING", orderDetail.workProcesses || []),
        worker: workerToNull(
          getProcessWorker("IRONING", orderDetail.workProcesses || []),
        ),
        startTime: toNullIfUndefined(
          getProcessTime("IRONING", orderDetail.workProcesses || [], "start"),
        ),
        endTime: toNullIfUndefined(
          getProcessTime("IRONING", orderDetail.workProcesses || [], "end"),
        ),
        notes: toNullIfUndefined(
          getProcessNotes("IRONING", orderDetail.workProcesses || []),
        ),
      },
      packing: {
        status: getProcessStatus("PACKING", orderDetail.workProcesses || []),
        worker: workerToNull(
          getProcessWorker("PACKING", orderDetail.workProcesses || []),
        ),
        startTime: toNullIfUndefined(
          getProcessTime("PACKING", orderDetail.workProcesses || [], "start"),
        ),
        endTime: toNullIfUndefined(
          getProcessTime("PACKING", orderDetail.workProcesses || [], "end"),
        ),
        notes: toNullIfUndefined(
          getProcessNotes("PACKING", orderDetail.workProcesses || []),
        ),
      },
    },
    statusHistory: generateStatusHistory(),
  };

  return (
    <div className="container mx-auto p-4">
      <OrderHeader order={transformedOrder} />

      <div className="mt-4 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Timeline</h2>
            <OrderTimeline
              statusHistory={transformedOrder.statusHistory}
              currentStatus={orderDetail.orderStatus || "WAITING_FOR_PICKUP"}
            />
          </div>

          <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
            <OrderItemsSection items={transformedOrder.items} />
          </div>

          <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
            <ProcessingSection
              processingInfo={transformedOrder.processingInfo}
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
            <CustomerAddressSection
              customer={transformedOrder.customer}
              pickupAddress={transformedOrder.pickupAddress}
              deliveryAddress={transformedOrder.deliveryAddress}
            />
          </div>

          <div className="bg-card mb-6 rounded-lg border p-4 shadow-sm">
            <PaymentSection payment={transformedOrder.payment} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getProcessStatus(type: string, workProcesses: any[]): string {
  const process = workProcesses.find((wp) => wp.workerType === type);
  if (!process) return "Pending";
  if (process.completedAt) return "Completed";
  return "In Progress";
}

function getProcessWorker(
  type: string,
  workProcesses: any[],
): { name: string } | undefined {
  const process = workProcesses.find((wp) => wp.workerType === type);
  if (!process?.worker?.name) return undefined;
  return { name: process.worker.name };
}

function getProcessTime(
  type: string,
  workProcesses: any[],
  timeType: "start" | "end",
): string | undefined {
  const process = workProcesses.find((wp) => wp.workerType === type);
  if (!process) return undefined;

  const time = timeType === "start" ? process.createdAt : process.completedAt;
  return time || undefined;
}

function getProcessNotes(
  type: string,
  workProcesses: any[],
): string | undefined {
  const process = workProcesses.find((wp) => wp.workerType === type);
  return process?.notes || undefined;
}
