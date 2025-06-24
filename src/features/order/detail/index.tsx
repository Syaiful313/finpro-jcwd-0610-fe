'use client';

import useGetDetailOrder from "@/hooks/api/order/useGetDetailOrder";
import { FC, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OrderProgressBar from "./components/ProgressBar";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import useCreatePaymentLink from "@/hooks/api/payment/useCreatePaymentLink";
import useConfirmOrder from "@/hooks/api/order/useConfirmOrder";
import ConfirmDialog from "@/features/user/profile/components/ConfirmDialog";

interface OrderDetailPageProps {
  uuid: string;
}

const OrderDetailPage: FC<OrderDetailPageProps> = ({ uuid }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { data: order, isLoading } = useGetDetailOrder(uuid);
    const { mutate: createPaymentLink } = useCreatePaymentLink();
    const { mutate: confirmOrder } = useConfirmOrder();
    if (isLoading) return <Loading/>
    if (!order) return <NotFound/>

    return (
    <div className="bg-gradient-to-br from-white to-blue-50 px-8 lg:px-50 py-32 mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-8 space-y-8 text-gray-700"
        id="invoice">
        <header className="border-b pb-6 flex justify-between items-start">
            <div>
            <h1 className="text-3xl font-extrabold text-primary">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full uppercase font-semibold">
                {order.paymentStatus}
            </span>
            </div>
        </header>
        <OrderProgressBar orderStatus={order.orderStatus}/>
        <section className="grid grid-cols-2 gap-4">
            <div>
            <h2 className="text-sm text-gray-400">Order Status</h2>
            <p className="text-md md:text-lg font-semibold text-primary break-words whitespace-normal">{order.orderStatus}</p>
            </div>
            <div>
            <h2 className="text-sm text-gray-400">Pickup Time</h2>
            <p className="text-base">{order.scheduledPickupTime ? new Date(order.scheduledPickupTime).toLocaleString() : "–"}</p>
            </div>
            <div>
            <h2 className="text-sm text-gray-400">Delivery Time</h2>
            <p className="text-base">
                {order.scheduledDeliveryTime ? new Date(order.scheduledDeliveryTime).toLocaleString() : "—"}
            </p>
            </div>
            <div>
            <h2 className="text-sm text-gray-400">Delivery Address</h2>
            <p className="text-base">
                {order.addressLine}, {order.district}, {order.city}, {order.province}, {order.postalCode}
            </p>
            </div>
        </section>

        <section className="border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
            <div className="flex justify-between">
                <span className="text-sm">Total Weight</span>
                <span className="text-sm font-medium">{order.totalWeight} kg</span>
            </div>
            <div className="flex justify-between">
                <span className="text-sm">Delivery Fee</span>
                <span className="text-sm font-medium">Rp {order.totalDeliveryFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span>Rp {order.totalPrice?.toFixed(2)}</span>
            </div>
            </div>

            <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Scan to track this order</p>
            <div className="inline-block p-3 bg-gray-100 rounded-xl">
                <QRCodeCanvas
                value={`http://bubblifly.site/order/${order.uuid}`}
                size={100}
                level="H"
                bgColor="#ffffff"
                fgColor="#1e3a8a"
                />
            </div>
            </div>
        </section>

        <footer className="flex flex-col sm:flex-row sm:justify-end sm:items-end gap-4 pt-6 border-t w-full">
            {order.actualDeliveryTime && order.orderStatus !== "COMPLETED" && (
                <span className="text-sm text-gray-500 w-full sm:w-auto text-left sm:text-right">
                Your order will be auto-confirmed on{" "}
                <span className="font-semibold">
                    {new Date(
                    new Date(order.actualDeliveryTime).getTime() + 2 * 24 * 60 * 60 * 1000
                    ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    })}
                </span>
                </span>
            )}
            {order.orderStatus === "WAITING_FOR_PICKUP" && (
                <span className="text-sm text-gray-500 w-full sm:w-auto text-left sm:text-right">
                For order cancellations, please contact our support team at{" "}
                <span className="font-semibold">
                    +62-8567-7658-888
                </span>
                </span>
            )}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                onClick={() => createPaymentLink({ uuid: order.uuid })}
                className={`w-full sm:w-auto min-w-[140px] px-5 py-2 rounded-lg transition text-white ${
                    order.paymentStatus === "PAID" || order.totalPrice === null
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={order.paymentStatus === "PAID"}
                >
                Proceed Payment
                </button>
                <button
                onClick={() => setShowConfirm(true)}
                className={`w-full sm:w-auto min-w-[140px] px-5 py-2 rounded-lg text-white transition ${
                    order.orderStatus !== "DELIVERED_TO_CUSTOMER"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={order.orderStatus !== "DELIVERED_TO_CUSTOMER"}
                >
                Confirm Order
                </button>
            </div>
        </footer>

        <ConfirmDialog
        isOpen={showConfirm}
        title="Confirm order"
        message="Are you sure you want to confirm this order?"
        onConfirm={() => {
            setShowConfirm(false);
            confirmOrder(order.uuid);
        }}
        onCancel={() => setShowConfirm(false)}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
      />
    </div>
    );
};

export default OrderDetailPage;