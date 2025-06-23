"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Printer } from "lucide-react";
import Link from "next/link";

interface OrderDetail {
  orderNumber: string;
  status: string;
  createdAt: string;
  outletName: string;
  payment: {
    totalAmount: number;
  };
  items: any[];
}

export function OrderHeader({ order }: { order: OrderDetail }) {
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING_FOR_PICKUP":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "BEING_WASHED":
      case "BEING_IRONED":
      case "BEING_PACKED":
        return "bg-blue-500 hover:bg-blue-600";
      case "READY_FOR_DELIVERY":
        return "bg-purple-500 hover:bg-purple-600";
      case "COMPLETED":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstimatedCompletion = () => {
    const estimatedDate = new Date(order.createdAt);
    estimatedDate.setDate(estimatedDate.getDate() + 2);
    return formatDate(estimatedDate.toISOString());
  };

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            {order.orderNumber}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="mr-1 h-4 w-4" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            <span>Print Invoice</span>
          </Button>
          <Link href="/admin/orders">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Pesanan
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-muted/70 mt-4 grid grid-cols-1 gap-4 rounded-md p-3 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-xs">Outlet</p>
          <p className="font-medium">{order.outletName}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Total Amount</p>
          <p className="font-medium">
            {formatRupiah(order.payment.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Items Count</p>
          <p className="font-medium">{order.items.length} items</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Est. Completion</p>
          <p className="font-medium">{getEstimatedCompletion()}</p>
        </div>
      </div>
    </div>
  );
}
