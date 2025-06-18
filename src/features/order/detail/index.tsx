'use client';

import useGetDetailOrder from "@/hooks/api/order/useGetDetailOrder";
import { FC } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OrderProgressBar from "./components/ProgressBar";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";

interface OrderDetailPageProps {
  uuid: string;
}

const OrderDetailPage: FC<OrderDetailPageProps> = ({ uuid }) => {
    const { data: order, isLoading } = useGetDetailOrder(uuid);
    if (isLoading) return <Loading/>
    if (!order) return <NotFound/>

    return (
        <div
        className="mx-auto bg-gradient-to-br from-white to-blue-50 px-8 lg:px-50 py-32 text-gray-800"
        id="invoice"
        >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">Order Detail</h2>
                <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
            </div>
            <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-base font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>
        </div>

        <OrderProgressBar orderStatus={order.orderStatus} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6 mb-6">
            <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-base font-semibold text-green-600">{order.orderStatus}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="text-base font-semibold">{order.paymentStatus}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6 mb-6">
            <div>
                <p className="text-sm text-gray-500">Pickup Time</p>
                <p className="text-base">
                    {order.scheduledPickupTime
                    ? new Date(order.scheduledPickupTime).toLocaleString()
                    : "—"}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Delivery Time</p>
                <p className="text-base">
                    {order.scheduledDeliveryTime
                    ? new Date(order.scheduledDeliveryTime).toLocaleString()
                    : "—"}
                </p>
            </div>
        </div>

        <div className="border-b pb-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="text-base">
            {order.addressLine}, {order.district}, {order.city}, {order.province}, {order.postalCode}
            </p>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span>Total Weight</span>
                <span>{order.totalWeight} kg</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>Rp {order.totalDeliveryFee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-4">
                <span>Total</span>
                <span>Rp {order.totalPrice?.toFixed(2)}</span>
            </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">Scan to track this order</p>
            <div className="inline-block p-2 border rounded-xl">
            <QRCodeCanvas
                value={`https://yourdomain.com/track/${order.uuid}`}
                size={120}
                level="H"
                bgColor="#ffffff"
                fgColor="#1e3a8a"
            />
            </div>
        </div>
        </div>
    );
};

export default OrderDetailPage;