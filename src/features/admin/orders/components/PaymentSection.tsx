"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface PaymentInfo {
  totalAmount: number;
  status: string;
  method?: string;
  date: string | null;
  transactionId?: string | null;
  dueDate?: string;

  breakdown?: {
    itemsTotal: number;
    deliveryFee: number;
    grandTotal: number;
  };
  xendit?: {
    xenditId: string;
    invoiceUrl?: string;
    successRedirectUrl?: string;
    expiryDate?: string;
    xenditStatus?: string;
    isExpired: boolean;
  };
  actions?: {
    canPay: boolean;
    canRefund: boolean;
    canGenerateNewInvoice: boolean;
  };
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

  const formatDate = (dateString: string | null | undefined) => {
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
      case "PAID":
        return "Lunas";
      case "Pending":
      case "WAITING_PAYMENT":
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

  const getPaymentStatusBadge = (status: string) => {
    const isPaid = status === "Paid" || status === "PAID";
    return (
      <Badge className={isPaid ? "bg-green-500" : "bg-yellow-500"}>
        {getPaymentStatusInIndonesian(status)}
      </Badge>
    );
  };

  const getPaymentMethodDisplay = (method?: string) => {
    if (!method || method === "Pending") return "Menunggu";

    switch (method) {
      case "BANK_TRANSFER":
        return "Transfer Bank";
      case "E_WALLET":
        return "E-Wallet";
      case "CREDIT_CARD":
        return "Kartu Kredit";
      case "QRIS":
        return "QRIS";
      case "VIRTUAL_ACCOUNT":
        return "Virtual Account";
      case "RETAIL_OUTLET":
        return "Retail Outlet";
      case "ONLINE_PAYMENT":
        return "Pembayaran Online";
      default:
        return method;
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

          {payment.breakdown && (
            <div className="rounded-md border p-4">
              <h3 className="mb-3 font-medium">Rincian Biaya</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Laundry</span>
                  <span>{formatRupiah(payment.breakdown.itemsTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Antar</span>
                  <span>{formatRupiah(payment.breakdown.deliveryFee)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatRupiah(payment.breakdown.grandTotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">Status Pembayaran</span>
              {getPaymentStatusBadge(payment.status)}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>
                    {payment.status === "Paid" || payment.status === "PAID"
                      ? "Tanggal Pembayaran"
                      : "Tanggal Pembuatan"}
                  </span>
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

          {payment.xendit && (
            <div className="rounded-md border p-4">
              <h3 className="mb-3 font-medium">Detail Pembayaran Online</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Xendit ID</span>
                  <span className="font-mono text-xs">
                    {payment.xendit.xenditId}
                  </span>
                </div>

                {payment.xendit.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kadaluarsa</span>
                    <span
                      className={`text-xs ${payment.xendit.isExpired ? "text-red-600" : "text-gray-600"}`}
                    >
                      {formatDate(payment.xendit.expiryDate)}
                      {payment.xendit.isExpired && (
                        <span className="ml-2 text-red-600">(Expired)</span>
                      )}
                    </span>
                  </div>
                )}

                {payment.xendit.invoiceUrl && !payment.xendit.isExpired && (
                  <div className="mt-3">
                    <a
                      href={payment.xendit.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka Halaman Pembayaran</span>
                    </a>
                  </div>
                )}

                {payment.xendit.isExpired && (
                  <div className="mt-3 rounded-md bg-red-50 p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Invoice Kadaluarsa
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-red-600">
                      Silakan hubungi customer service untuk membuat invoice
                      baru
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
