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
        // <div className="mx-auto bg-gradient-to-br from-white to-blue-50 px-8 lg:px-50 py-32 text-gray-800"
        //     id="invoice">
        //     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
        //         <div>
        //             <h2 className="text-2xl sm:text-3xl font-bold text-primary">Order Detail</h2>
        //             <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
        //         </div>
        //         <div className="text-left sm:text-right">
        //             <p className="text-sm text-gray-500">Created</p>
        //             <p className="text-base font-medium">
        //                 {new Date(order.createdAt).toLocaleString()}
        //             </p>
        //         </div>
        //     </div>

        //     <OrderProgressBar orderStatus={order.orderStatus} />

        //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6 mb-6">
        //         <div>
        //             <p className="text-sm text-gray-500">Status</p>
        //             <p className="text-base font-semibold text-green-600">{order.orderStatus}</p>
        //         </div>
        //         <div>
        //             <p className="text-sm text-gray-500">Payment</p>
        //             <p className="text-base font-semibold">{order.paymentStatus}</p>
        //         </div>
        //         <button onClick={() => {createPaymentLink({uuid: order.uuid})}}>
        //             Generate Payment Link
        //         </button>
        //         <button onClick={() => {confirmOrder(order.uuid)}}>
        //             Confirm Order
        //         </button>
        //     </div>

        //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6 mb-6">
        //         <div>
        //             <p className="text-sm text-gray-500">Pickup Time</p>
        //             <p className="text-base">
        //                 {order.scheduledPickupTime
        //                 ? new Date(order.scheduledPickupTime).toLocaleString()
        //                 : "—"}
        //             </p>
        //         </div>
        //         <div>
        //             <p className="text-sm text-gray-500">Delivery Time</p>
        //             <p className="text-base">
        //                 {order.scheduledDeliveryTime
        //                 ? new Date(order.scheduledDeliveryTime).toLocaleString()
        //                 : "—"}
        //             </p>
        //         </div>
        //     </div>

        //     <div className="border-b pb-6 mb-6">
        //         <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
        //         <p className="text-base">
        //         {order.addressLine}, {order.district}, {order.city}, {order.province}, {order.postalCode}
        //         </p>
        //     </div>

        //     <div className="space-y-2">
        //         <div className="flex justify-between text-sm">
        //             <span>Total Weight</span>
        //             <span>{order.totalWeight} kg</span>
        //         </div>
        //         <div className="flex justify-between text-sm">
        //             <span>Delivery Fee</span>
        //             <span>Rp {order.totalDeliveryFee?.toFixed(2)}</span>
        //         </div>
        //         <div className="flex justify-between text-lg font-semibold border-t pt-4">
        //             <span>Total</span>
        //             <span>Rp {order.totalPrice?.toFixed(2)}</span>
        //         </div>
        //     </div>

        //     <div className="mt-8 text-center">
        //         <p className="text-sm text-gray-500 mb-2">Scan to track this order</p>
        //         <div className="inline-block p-2 border rounded-xl">
        //         <QRCodeCanvas
        //             value={`https://yourdomain.com/track/${order.uuid}`}
        //             size={120}
        //             level="H"
        //             bgColor="#ffffff"
        //             fgColor="#1e3a8a"
        //         />
        //         </div>
        //     </div>
        // </div>
    <div className="bg-gradient-to-br from-white to-blue-50 px-8 lg:px-50 py-32 mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-8 space-y-8 text-gray-700"
        id="invoice">
        <header className="border-b pb-6 flex justify-between items-start">
            <div>
            <h1 className="text-3xl font-extrabold text-blue-800">Order #{order.orderNumber}</h1>
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
            <p className="text-lg font-semibold text-blue-600">{order.orderStatus}</p>
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
                value={`https://yourdomain.com/track/${order.uuid}`}
                size={100}
                level="H"
                bgColor="#ffffff"
                fgColor="#1e3a8a"
                />
            </div>
            </div>
        </section>

        <footer className="flex gap-4 justify-end pt-6 border-t">
            <button
            onClick={() => createPaymentLink({ uuid: order.uuid })}
            className={`px-5 py-2 rounded-lg transition text-white ${order.paymentStatus === "PAID" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={order.paymentStatus === "PAID"}
            >
            Proceed Payment
            </button>
            <button
            onClick={() => setShowConfirm(true)}
            className={`px-5 py-2 rounded-lg text-white transition ${order.orderStatus !== "DELIVERED_TO_CUSTOMER" ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            disabled={order.orderStatus !== "DELIVERED_TO_CUSTOMER"}
            >
            Confirm Order
            </button>
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