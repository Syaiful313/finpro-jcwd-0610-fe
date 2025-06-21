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

    if (orderDetail.timeline) {
      orderDetail.timeline.forEach((event) => {
        if (event.type === "WORK_PROCESS") {
          const workerName = event.metadata?.worker || "Unknown Worker";

          history.push({
            status: event.event.includes("Started")
              ? getStatusFromEvent(event.event)
              : event.event,
            timestamp: event.timestamp,
            updatedBy: {
              name: workerName,
              role: "worker",
            },
            notes: event.description,
          });
        }
      });
    }

    return history.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  };

  const getStatusFromEvent = (event: string): string => {
    if (event.includes("Washing")) return "BEING_WASHED";
    if (event.includes("Ironing")) return "BEING_IRONED";
    if (event.includes("Packing")) return "BEING_PACKED";
    return event;
  };

  const transformedOrder = {
    orderNumber: safeString(orderDetail.orderNumber),
    status: safeString(orderDetail.orderStatus),
    createdAt: orderDetail.createdAt,
    outletName: safeString(orderDetail.outlet?.outletName),

    payment: {
      totalAmount:
        orderDetail.payment?.totalAmount || orderDetail.pricing?.total || 0,
      status: orderDetail.payment?.statusInfo?.isPaid ? "Paid" : "Pending",
      method: orderDetail.payment?.statusInfo?.paymentMethod || "Pending",
      date: orderDetail.payment?.paidAt || null,
      transactionId: orderDetail.payment?.xendit?.xenditId || null,

      breakdown: orderDetail.payment?.breakdown,
      xendit: orderDetail.payment?.xendit,
      actions: orderDetail.payment?.actions,
    },

    items: (orderDetail.items || []).map((item) => ({
      id: item.id.toString(),
      name: safeString(item.laundryItem?.name),
      description:
        `${item.laundryItem?.category || ""} ${[item.color, item.brand, item.materials].filter(Boolean).join(", ")}`.trim(),
      price: item.pricePerUnit || 0,
      quantity: item.quantity || item.weight || 1,
      weight: item.weight || 0,
      pricingType: item.laundryItem?.pricingType,
      details: item.details || [],
    })),

    customer: {
      name: safeString(orderDetail.customer?.name),
      phone: safeString(orderDetail.customer?.phoneNumber),
      email: orderDetail.customer?.email,
      verified: true,
    },

    pickupAddress: {
      address: safeString(orderDetail.deliveryAddress?.fullAddress),
      scheduledTime: toNullIfUndefined(
        orderDetail.schedule?.scheduledPickupTime,
      ),
      actualTime: toNullIfUndefined(orderDetail.schedule?.actualPickupTime),
      driver: orderDetail.pickup?.jobs?.[0]?.driver
        ? {
            name: safeString(orderDetail.pickup.jobs[0].driver),
            phone: orderDetail.pickup.jobs[0].driverPhone,
          }
        : undefined,
    },

    deliveryAddress: {
      address: safeString(orderDetail.deliveryAddress?.fullAddress),
      scheduledTime: toNullIfUndefined(
        orderDetail.schedule?.scheduledDeliveryTime,
      ),
      actualTime: toNullIfUndefined(orderDetail.schedule?.actualDeliveryTime),
      driver: orderDetail.delivery?.jobs?.[0]?.driver
        ? {
            name: safeString(orderDetail.delivery.jobs[0].driver),
            phone: orderDetail.delivery.jobs[0].driverPhone,
          }
        : undefined,
      deliveryInfo: orderDetail.delivery?.info,
    },

    processingInfo: {
      washing: getProcessInfo("WASHING", orderDetail.workProcess),
      ironing: getProcessInfo("IRONING", orderDetail.workProcess),
      packing: getProcessInfo("PACKING", orderDetail.workProcess),

      current: orderDetail.workProcess?.current,
      completed: orderDetail.workProcess?.completed,
      progress: orderDetail.workProcess?.progress,
    },

    statusHistory: generateStatusHistory(),

    timeline: orderDetail.timeline,
    delivery: orderDetail.delivery,
    pickup: orderDetail.pickup,
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

          {/* New sections for additional data */}
          {orderDetail.delivery?.info && (
            <div className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold">
                Delivery Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="ml-2 font-medium">
                    {orderDetail.delivery.info.distance} km
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery Fee:</span>
                  <span className="ml-2 font-medium">
                    Rp{" "}
                    {orderDetail.delivery.info.actualFee?.toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Base Fee:</span>
                  <span className="ml-2">
                    Rp{" "}
                    {orderDetail.delivery.info.baseFee?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Per KM:</span>
                  <span className="ml-2">
                    Rp{" "}
                    {orderDetail.delivery.info.perKmFee?.toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">
                    Within Service Radius:
                  </span>
                  <span
                    className={`ml-2 font-medium ${orderDetail.delivery.info.withinServiceRadius ? "text-green-600" : "text-red-600"}`}
                  >
                    {orderDetail.delivery.info.withinServiceRadius
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>
            </div>
          )}
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

function getProcessInfo(
  type: "WASHING" | "IRONING" | "PACKING",
  workProcess?: OrderDetail["workProcess"],
) {
  if (workProcess?.current?.type === type) {
    return {
      status: "In Progress",
      worker: workProcess.current.worker
        ? { name: workProcess.current.worker }
        : null,
      startTime: workProcess.current.startedAt || null,
      endTime: null,
      notes: workProcess.current.notes || null,
    };
  }

  const completedProcess = workProcess?.completed?.find((p) => p.type === type);
  if (completedProcess) {
    return {
      status: "Completed",
      worker: completedProcess.worker
        ? { name: completedProcess.worker }
        : null,
      startTime: completedProcess.startedAt || null,
      endTime: completedProcess.completedAt || null,
      notes: completedProcess.notes || null,
    };
  }

  const stage = workProcess?.progress?.stages?.find((s) => s.stage === type);
  if (stage) {
    return {
      status:
        stage.status === "COMPLETED"
          ? "Completed"
          : stage.status === "IN_PROGRESS"
            ? "In Progress"
            : "Pending",
      worker: stage.worker ? { name: stage.worker } : null,
      startTime: stage.startedAt || null,
      endTime: stage.completedAt || null,
      notes: null,
    };
  }

  return {
    status: "Pending",
    worker: null,
    startTime: null,
    endTime: null,
    notes: null,
  };
}
