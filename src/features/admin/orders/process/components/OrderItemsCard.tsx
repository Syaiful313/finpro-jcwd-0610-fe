import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldArray } from "formik";
import { Package, Plus, ShoppingBag, Trash2 } from "lucide-react";

interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
}

interface ProcessOrderItem {
  laundryItemId: number;
  quantity: number;
  weight: number;
  color: string;
  brand: string;
  materials: string;
  orderItemDetails: Array<{
    name: string;
    qty: number;
  }>;
}

interface OrderItemsCardProps {
  orderItems: ProcessOrderItem[];
  laundryItems: LaundryItem[];
  errors: any;
  touched: any;
  isProcessing: boolean;
  setFieldValue: (field: string, value: any) => void;
  getLaundryItemById: (id: number) => LaundryItem | undefined;
  formatCurrency: (amount: number) => string;
}

export function OrderItemsCard({
  orderItems,
  laundryItems,
  errors,
  touched,
  isProcessing,
  setFieldValue,
  getLaundryItemById,
  formatCurrency,
}: OrderItemsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 pb-3 md:pb-0 text-lg sm:text-xl">
            <Package className="h-5 w-5" />
            Item Laundry
          </CardTitle>
          <FieldArray name="orderItems">
            {({ push }) => (
              <Button
                type="button"
                onClick={() =>
                  push({
                    laundryItemId: -1,
                    quantity: 0,
                    weight: 0,
                    color: "",
                    brand: "",
                    materials: "",
                    orderItemDetails: [],
                  })
                }
                size="sm"
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Item
              </Button>
            )}
          </FieldArray>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <FieldArray name="orderItems">
          {({ remove }) => (
            <>
              {orderItems.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <ShoppingBag className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="text-base">Belum ada item laundry</p>
                  <p className="text-sm">
                    Klik "Tambah Item" untuk menambah item
                  </p>
                </div>
              ) : (
                orderItems.map((item, index) => {
                  const laundryItem = getLaundryItemById(item.laundryItemId);
                  const itemErrors = errors.orderItems?.[index] as any;
                  const itemTouched = touched.orderItems?.[index] as any;

                  return (
                    <Card key={index} className="relative">
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <CardTitle className="text-base sm:text-lg">
                            Item {index + 1}
                          </CardTitle>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isProcessing}
                                className="w-full sm:w-auto"
                              >
                                <Trash2 className="h-4 w-4 sm:mr-2" />
                                <span className="sm:inline">Hapus</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mx-2 w-[calc(100vw-1rem)] max-w-md sm:mx-4 sm:w-[calc(100vw-2rem)]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus item ini?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                                <AlertDialogCancel className="w-full sm:w-auto">
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => remove(index)}
                                  className="w-full sm:w-auto"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {/* Laundry Item Selection */}
                        <div className="space-y-2">
                          <Label className="text-sm">Barang Cucian</Label>
                          <Select
                            value={
                              item.laundryItemId === -1
                                ? ""
                                : item.laundryItemId.toString()
                            }
                            onValueChange={(value) => {
                              setFieldValue(
                                `orderItems.${index}.laundryItemId`,
                                parseInt(value),
                              );
                              setFieldValue(`orderItems.${index}.quantity`, 0);
                              setFieldValue(`orderItems.${index}.weight`, 0);
                            }}
                            disabled={isProcessing}
                          >
                            <SelectTrigger
                              className={
                                itemErrors?.laundryItemId &&
                                itemTouched?.laundryItemId
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Pilih jenis laundry" />
                            </SelectTrigger>
                            <SelectContent>
                              {laundryItems.map((laundryItem) => (
                                <SelectItem
                                  key={laundryItem.id}
                                  value={laundryItem.id.toString()}
                                >
                                  <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="font-medium">
                                      {laundryItem.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {itemErrors?.laundryItemId &&
                            itemTouched?.laundryItemId && (
                              <p className="text-sm text-red-500">
                                {itemErrors.laundryItemId}
                              </p>
                            )}
                        </div>

                        {/* Quantity or Weight based on pricing type */}
                        {laundryItem && (
                          <>
                            {laundryItem.pricingType === "PER_PIECE" ? (
                              <div className="space-y-2">
                                <Label className="text-sm">
                                  Quantity (pcs) *
                                </Label>
                                <Field name={`orderItems.${index}.quantity`}>
                                  {({ field }: any) => (
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                      type="number"
                                      min="0"
                                      placeholder="Masukkan jumlah pieces"
                                      className={
                                        itemErrors?.quantity &&
                                        itemTouched?.quantity
                                          ? "border-red-500"
                                          : ""
                                      }
                                      disabled={isProcessing}
                                    />
                                  )}
                                </Field>
                                {itemErrors?.quantity &&
                                  itemTouched?.quantity && (
                                    <p className="text-sm text-red-500">
                                      {itemErrors.quantity}
                                    </p>
                                  )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Label className="text-sm">Berat (kg) *</Label>
                                <Field name={`orderItems.${index}.weight`}>
                                  {({ field }: any) => (
                                    <Input
                                      {...field}
                                      value={field.value || ""}
                                      type="number"
                                      step="0.1"
                                      min="0"
                                      placeholder="Masukkan berat dalam kg"
                                      className={
                                        itemErrors?.weight &&
                                        itemTouched?.weight
                                          ? "border-red-500"
                                          : ""
                                      }
                                      disabled={isProcessing}
                                    />
                                  )}
                                </Field>
                                {itemErrors?.weight && itemTouched?.weight && (
                                  <p className="text-sm text-red-500">
                                    {itemErrors.weight}
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {/* Additional Details */}
                        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Warna</Label>
                            <Field name={`orderItems.${index}.color`}>
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Masukkan warna"
                                  disabled={isProcessing}
                                />
                              )}
                            </Field>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Merk</Label>
                            <Field name={`orderItems.${index}.brand`}>
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Masukkan merk"
                                  disabled={isProcessing}
                                />
                              )}
                            </Field>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Bahan</Label>
                            <Field name={`orderItems.${index}.materials`}>
                              {({ field }: any) => (
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Masukkan jenis bahan"
                                  disabled={isProcessing}
                                />
                              )}
                            </Field>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Label className="text-sm">
                              Detail Item (Opsional)
                            </Label>
                            <FieldArray
                              name={`orderItems.${index}.orderItemDetails`}
                            >
                              {({ push }) => (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    push({
                                      name: "",
                                      qty: 1,
                                    })
                                  }
                                  disabled={isProcessing}
                                  className="w-full sm:w-auto"
                                >
                                  <Plus className="mr-2 h-3 w-3" />
                                  Tambah Detail
                                </Button>
                              )}
                            </FieldArray>
                          </div>

                          <FieldArray
                            name={`orderItems.${index}.orderItemDetails`}
                          >
                            {({ remove: removeDetail }) => (
                              <>
                                {item.orderItemDetails &&
                                  item.orderItemDetails.length > 0 && (
                                    <div className="space-y-3">
                                      {item.orderItemDetails.map(
                                        (detail, detailIndex) => {
                                          const detailErrors =
                                            itemErrors?.orderItemDetails?.[
                                              detailIndex
                                            ];
                                          const detailTouched =
                                            itemTouched?.orderItemDetails?.[
                                              detailIndex
                                            ];

                                          return (
                                            <div
                                              key={detailIndex}
                                              className="flex flex-col gap-2 sm:flex-row sm:items-end"
                                            >
                                              <div className="flex-1 space-y-1">
                                                <Label className="text-xs">
                                                  Nama Detail
                                                </Label>
                                                <Field
                                                  name={`orderItems.${index}.orderItemDetails.${detailIndex}.name`}
                                                >
                                                  {({ field }: any) => (
                                                    <Input
                                                      {...field}
                                                      value={field.value || ""}
                                                      placeholder="Contoh: Kemeja Putih"
                                                      className={
                                                        detailErrors?.name &&
                                                        detailTouched?.name
                                                          ? "border-red-500"
                                                          : ""
                                                      }
                                                      disabled={isProcessing}
                                                    />
                                                  )}
                                                </Field>
                                                {detailErrors?.name &&
                                                  detailTouched?.name && (
                                                    <p className="text-xs text-red-500">
                                                      {detailErrors.name}
                                                    </p>
                                                  )}
                                              </div>
                                              <div className="w-full space-y-1 sm:w-24">
                                                <Label className="text-xs">
                                                  Qty
                                                </Label>
                                                <Field
                                                  name={`orderItems.${index}.orderItemDetails.${detailIndex}.qty`}
                                                >
                                                  {({ field }: any) => (
                                                    <Input
                                                      {...field}
                                                      value={field.value || ""}
                                                      type="number"
                                                      min="1"
                                                      className={
                                                        detailErrors?.qty &&
                                                        detailTouched?.qty
                                                          ? "border-red-500"
                                                          : ""
                                                      }
                                                      disabled={isProcessing}
                                                    />
                                                  )}
                                                </Field>
                                                {detailErrors?.qty &&
                                                  detailTouched?.qty && (
                                                    <p className="text-xs text-red-500">
                                                      {detailErrors.qty}
                                                    </p>
                                                  )}
                                              </div>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  removeDetail(detailIndex)
                                                }
                                                disabled={isProcessing}
                                                className="w-full sm:w-auto"
                                              >
                                                <Trash2 className="h-3 w-3 sm:mr-2" />
                                                <span className="sm:hidden">
                                                  Hapus Detail
                                                </span>
                                              </Button>
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  )}
                              </>
                            )}
                          </FieldArray>
                        </div>

                        {/* Item Price Calculation */}
                        {laundryItem &&
                          ((item.quantity && item.quantity > 0) ||
                            (item.weight && item.weight > 0)) && (
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center justify-between text-sm">
                                <span>Subtotal Item:</span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    laundryItem.pricingType === "PER_PIECE" &&
                                      item.quantity > 0
                                      ? laundryItem.basePrice * item.quantity
                                      : laundryItem.pricingType === "PER_KG" &&
                                          item.weight > 0
                                        ? laundryItem.basePrice * item.weight
                                        : 0,
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </>
          )}
        </FieldArray>

        {errors.orderItems && typeof errors.orderItems === "string" && (
          <p className="text-sm text-red-500">{errors.orderItems}</p>
        )}
      </CardContent>
    </Card>
  );
}
