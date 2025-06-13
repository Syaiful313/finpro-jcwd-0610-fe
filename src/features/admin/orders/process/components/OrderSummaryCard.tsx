import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Info, Loader2, Save, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeliveryEstimation {
  success: boolean;
  distance?: number;
  fee?: number;
  error?: string;
}

interface OrderSummaryCardProps {
  totalWeight: number;
  hasPerKg: boolean;
  totalItems: number;
  laundrySubtotal: number;
  estimatedTotal: number;
  deliveryEstimation: DeliveryEstimation;
  isProcessing: boolean;
  isValid: boolean;
  orderItemsLength: number;
  formatCurrency: (amount: number) => string;
}

export function OrderSummaryCard({
  totalWeight,
  hasPerKg,
  totalItems,
  laundrySubtotal,
  estimatedTotal,
  deliveryEstimation,
  isProcessing,
  isValid,
  orderItemsLength,
  formatCurrency,
}: OrderSummaryCardProps) {
  const router = useRouter();

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
              <span
                className={`font-medium ${deliveryEstimation.success ? "" : "text-muted-foreground"}`}
              >
                {deliveryEstimation.success ? (
                  <span className="flex flex-col items-end">
                    <span>
                      {formatCurrency(deliveryEstimation.fee!)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({deliveryEstimation.distance}km)
                    </span>
                  </span>
                ) : (
                  <span className="text-xs">
                    {deliveryEstimation.error ||
                      "Data tidak lengkap"}
                  </span>
                )}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">
              {deliveryEstimation.success
                ? "Total:"
                : "Estimasi Total:"}
            </span>
            <span className="text-lg font-bold">
              {deliveryEstimation.success
                ? formatCurrency(estimatedTotal)
                : `${formatCurrency(laundrySubtotal)}+`}
            </span>
          </div>
        </div>

        <Alert
          className={
            deliveryEstimation.success
              ? ""
              : "border-yellow-200 bg-yellow-50"
          }
        >
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {deliveryEstimation.success ? (
              <>
                Estimasi ongkos kirim berdasarkan jarak{" "}
                {deliveryEstimation.distance}km ke alamat
                customer. Total akhir mungkin sedikit berbeda saat
                pemrosesan.
              </>
            ) : (
              <>
                {deliveryEstimation.error ||
                  "Ongkos kirim akan dihitung otomatis berdasarkan alamat customer saat memproses order."}
              </>
            )}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={
              isProcessing ||
              !isValid ||
              orderItemsLength === 0
            }
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
            onClick={() => router.back()}
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