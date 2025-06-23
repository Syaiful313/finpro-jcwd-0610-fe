"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { useState } from "react";

export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  weight: number;
}

export function OrderItemsSection({ items }: { items: OrderItem[] }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalWeight = items.reduce(
    (sum, item) => sum + item.weight * item.quantity,
    0,
  );

  const total = subtotal;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-muted-foreground h-5 w-5" />
          <h2 className="text-xl font-semibold">Order Items</h2>
        </div>
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
        <>
          <ScrollArea className="h-full max-h-80 w-full rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-muted-foreground border-b text-left text-sm font-medium">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-center">Jumlah</th>
                    <th className="pb-2 text-right">Harga</th>
                    <th className="pb-2 text-right">Berat</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-2">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-muted-foreground text-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 text-center">{item.quantity}x</td>
                      <td className="py-2 text-right">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-2 text-right">{item.weight} kg</td>
                      <td className="py-2 text-right">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>

          <div className="rounded-md border p-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Berat:</span>
                  <span>{totalWeight.toFixed(1)} kg</span>
                </div>
              </div>

              <div className="flex items-end justify-between border-t pt-2 md:justify-end md:border-t-0 md:border-l md:pt-0 md:pl-4">
                <span className="text-base font-medium md:mr-4">Total:</span>
                <span className="text-primary text-lg font-bold">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
