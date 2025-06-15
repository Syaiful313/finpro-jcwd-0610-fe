import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "formik";
import { Scale } from "lucide-react";

interface TotalWeightCardProps {
  hasPerKg: boolean;
  totalWeight: number;
  errors: any;
  touched: any;
  isProcessing: boolean;
  orderItemsLength: number;
}

export function TotalWeightCard({
  hasPerKg,
  totalWeight,
  errors,
  touched,
  isProcessing,
  orderItemsLength,
}: TotalWeightCardProps) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Scale className="h-5 w-5" />
          Total Berat
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Label htmlFor="totalWeight" className="text-sm">
            Total Berat (kg){" "}
            {hasPerKg ? "*" : "(Opsional untuk item per pcs)"}
          </Label>
          <Field name="totalWeight">
            {({ field }: any) => (
              <Input
                {...field}
                value={field.value || ""}
                id="totalWeight"
                type="number"
                step="0.1"
                min="0"
                placeholder={
                  hasPerKg
                    ? "Masukkan total berat dalam kg"
                    : "Opsional - untuk item per pcs"
                }
                className={
                  errors.totalWeight && touched.totalWeight
                    ? "border-red-500"
                    : ""
                }
                disabled={isProcessing}
              />
            )}
          </Field>
          {errors.totalWeight && touched.totalWeight && (
            <p className="text-sm text-red-500">{errors.totalWeight}</p>
          )}

          {!hasPerKg && orderItemsLength > 0 && (
            <p className="text-muted-foreground text-xs">
              💡 Total berat opsional untuk item per pcs. Sistem akan otomatis
              menggunakan berat default jika kosong.
            </p>
          )}
          {hasPerKg && (
            <p className="text-muted-foreground text-xs">
              ⚠️ Total berat wajib diisi karena ada item dengan pricing per kg.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}