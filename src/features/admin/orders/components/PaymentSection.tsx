"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Information</h2>
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
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-lg font-medium">Total Amount</span>
            </div>
            <span className="text-primary text-xl font-bold">
              {formatRupiah(payment.totalAmount)}
            </span>
          </div>

          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">Payment Status</span>
              <Badge
                className={
                  payment.status === "Paid" ? "bg-green-500" : "bg-yellow-500"
                }
              >
                {payment.status}
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              {payment.method && (
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method</span>
                  </div>
                  <span className="font-medium">{payment.method}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>Payment Date</span>
                </div>
                <span className="font-medium">{formatDate(payment.date)}</span>
              </div>

              {payment.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs font-medium">
                    {payment.transactionId}
                  </span>
                </div>
              )}

              {payment.dueDate && payment.status !== "Paid" && (
                <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm">
                  <div className="font-medium text-yellow-800">Payment Due</div>
                  <div className="text-yellow-600">
                    Please complete payment by {formatDate(payment.dueDate)}
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
