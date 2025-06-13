"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

interface PaymentInfo {
  totalAmount: number;
  status: string;
  method?: string;
  date: string | null;
  transactionId?: string;
  dueDate?: string;
}

export function PaymentSection({ payment }: { payment: PaymentInfo }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentStatusInIndonesian = (status: string) => {
    switch (status) {
      case "Paid":
        return "Lunas";
      case "Pending":
        return "Menunggu";
      case "Failed":
        return "Gagal";
      case "Cancelled":
        return "Dibatalkan";
      case "Refunded":
        return "Dikembalikan";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Informasi Pembayaran</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">Total Biaya</span>
            </div>
            <span className="text-primary text-xl font-bold">
              {formatRupiah(payment.totalAmount)}
            </span>
          </div>

          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">Status Pembayaran</span>
              <Badge
                className={
                  payment.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                }
              >
                {getPaymentStatusInIndonesian(payment.status)}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              {payment.method && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Metode Pembayaran</span>
                  </div>
                  <span className="font-medium">{payment.method}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>Tanggal Pembayaran</span>
                </div>
                <span className="font-medium">{formatDate(payment.date)}</span>
              </div>

              {payment.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ID Transaksi</span>
                  <span className="font-mono text-xs font-medium">
                    {payment.transactionId}
                  </span>
                </div>
              )}

              {payment.dueDate && payment.status !== "Paid" && (
                <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm">
                  <div className="font-medium text-yellow-800">
                    Jatuh Tempo Pembayaran
                  </div>
                  <div className="text-yellow-600">
                    Harap selesaikan pembayaran sebelum{" "}
                    {formatDate(payment.dueDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
