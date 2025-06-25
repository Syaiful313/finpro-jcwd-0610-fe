import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Calculator, Loader2, Save, Truck } from "lucide-react";

interface OrderSummaryCardProps {
  totalWeight: number;
  hasPerKg: boolean;
  totalItems: number;
  laundrySubtotal: number;
  isProcessing: boolean;
  isValid: boolean;
  orderItemsLength: number;
  formatCurrency: (amount: number) => string;
  onNavigateBack?: () => void;
  existingDeliveryFee?: number;
}

export function OrderSummaryCard({
  totalWeight,
  hasPerKg,
  totalItems,
  laundrySubtotal,
  isProcessing,
  isValid,
  orderItemsLength,
  formatCurrency,
  onNavigateBack,
  existingDeliveryFee,
}: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calculator className="h-5 w-5" />
          Ringkasan Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total Berat:</span>
            <span className="font-medium">
              {totalWeight > 0
                ? `${totalWeight} kg`
                : hasPerKg
                  ? "0 kg"
                  : "Auto"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Jumlah Item:</span>
            <span className="font-medium">{totalItems} item</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal Laundry:</span>
              <span className="font-medium">
                {formatCurrency(laundrySubtotal)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Ongkos Kirim:
              </span>
              {existingDeliveryFee ? (
                <span className="font-medium">
                  <span className="flex flex-col items-end">
                    <span>{formatCurrency(existingDeliveryFee)}</span>
                    <span className="text-muted-foreground text-xs">
                      (dari order)
                    </span>
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground text-xs font-medium">
                  Akan dihitung otomatis
                </span>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">
              {existingDeliveryFee ? "Estimasi Total:" : "Subtotal Laundry:"}
            </span>
            <span className="text-lg font-bold">
              {existingDeliveryFee
                ? formatCurrency(laundrySubtotal + existingDeliveryFee)
                : formatCurrency(laundrySubtotal)}
            </span>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Penting:</strong> Total akhir akan dihitung ulang oleh
            sistem menggunakan ongkos kirim yang sudah disepakati customer saat
            order.
            {existingDeliveryFee && " Preview di atas hanya sebagai referensi."}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={isProcessing || !isValid || orderItemsLength === 0}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Proses Pesanan
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onNavigateBack}
            className="w-full"
            disabled={isProcessing}
          >
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
