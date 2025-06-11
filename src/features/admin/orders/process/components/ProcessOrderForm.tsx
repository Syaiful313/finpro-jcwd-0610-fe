"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import useGetLaundryItems from "@/hooks/api/order/useGetLaundryItems";
import useProcessOrder, {
  cleanPayload,
} from "@/hooks/api/order/useProcessOrder";
import { DistanceCalculator } from "@/utils/distanceCalculator";
import { Field, FieldArray, Form, Formik } from "formik";
import {
  AlertCircle,
  ArrowLeft,
  Calculator,
  Info,
  Loader2,
  Package,
  Plus,
  Save,
  Scale,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as Yup from "yup";

interface OrderItemDetail {
  name: string;
  qty: number;
}

interface ProcessOrderItem {
  laundryItemId: number;
  quantity: number;
  weight: number;
  color: string;
  brand: string;
  materials: string;
  orderItemDetails: OrderItemDetail[];
}

interface CustomerAddress {
  latitude: number;
  longitude: number;
}

interface OutletInfo {
  latitude: number;
  longitude: number;
  deliveryBaseFee: number;
  deliveryPerKm: number;
  serviceRadius: number;
}

interface ProcessOrderFormProps {
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  customerAddress?: CustomerAddress | null;
  outletInfo?: OutletInfo | null;
}

interface FormValues {
  totalWeight: number;
  orderItems: ProcessOrderItem[];
}

export function ProcessOrderForm({
  orderId,
  orderNumber,
  customerName,
  customerAddress,
  outletInfo,
}: ProcessOrderFormProps) {
  const router = useRouter();

  const { data: laundryItems, isLoading: isLoadingItems } =
    useGetLaundryItems();
  const { mutateAsync: processOrder, isPending: isProcessing } =
    useProcessOrder();

  const initialValues: FormValues = {
    totalWeight: 0,
    orderItems: [],
  };

  const validationSchema = Yup.object({
    totalWeight: Yup.number()
      .min(0, "Total berat tidak boleh negatif")
      .when("orderItems", {
        is: (orderItems: ProcessOrderItem[]) => {
          return orderItems.some((item) => {
            const laundryItem = laundryItems?.find(
              (l) => l.id === item.laundryItemId,
            );
            return laundryItem?.pricingType === "PER_KG";
          });
        },
        then: (schema) =>
          schema
            .required(
              "Total berat harus diisi untuk item dengan pricing per KG",
            )
            .min(0.1, "Total berat harus lebih dari 0"),
        otherwise: (schema) => schema,
      }),
    orderItems: Yup.array()
      .min(1, "Minimal harus ada 1 item laundry")
      .of(
        Yup.object({
          laundryItemId: Yup.number()
            .required("Item laundry harus dipilih")
            .notOneOf([-1], "Item laundry harus dipilih"),
          quantity: Yup.number().when("laundryItemId", {
            is: (laundryItemId: number) => {
              const laundryItem = laundryItems?.find(
                (l) => l.id === laundryItemId,
              );
              return laundryItem?.pricingType === "PER_PIECE";
            },
            then: (schema) =>
              schema
                .required("Quantity harus diisi")
                .min(1, "Quantity harus lebih dari 0"),
            otherwise: (schema) => schema,
          }),
          weight: Yup.number().when("laundryItemId", {
            is: (laundryItemId: number) => {
              const laundryItem = laundryItems?.find(
                (l) => l.id === laundryItemId,
              );
              return laundryItem?.pricingType === "PER_KG";
            },
            then: (schema) =>
              schema
                .required("Weight harus diisi")
                .min(0.1, "Weight harus lebih dari 0"),
            otherwise: (schema) => schema,
          }),
          color: Yup.string(),
          brand: Yup.string(),
          materials: Yup.string(),
          orderItemDetails: Yup.array().of(
            Yup.object({
              name: Yup.string().required("Nama detail harus diisi"),
              qty: Yup.number()
                .required("Quantity detail harus diisi")
                .min(1, "Quantity detail harus lebih dari 0"),
            }),
          ),
        }),
      ),
  });

  const hasPerKgItems = (orderItems: ProcessOrderItem[]) => {
    return orderItems.some((item) => {
      const laundryItem = laundryItems?.find(
        (l) => l.id === item.laundryItemId,
      );
      return laundryItem?.pricingType === "PER_KG";
    });
  };

  const calculateLaundrySubtotal = (orderItems: ProcessOrderItem[]) => {
    if (!laundryItems) return 0;

    return orderItems.reduce((total, item) => {
      const laundryItem = laundryItems.find((l) => l.id === item.laundryItemId);
      if (!laundryItem) return total;

      if (laundryItem.pricingType === "PER_PIECE" && item.quantity > 0) {
        return total + laundryItem.basePrice * item.quantity;
      } else if (laundryItem.pricingType === "PER_KG" && item.weight > 0) {
        return total + laundryItem.basePrice * item.weight;
      }

      return total;
    }, 0);
  };

  const deliveryEstimation = useMemo(() => {
    return DistanceCalculator.getDeliveryEstimation(
      customerAddress || null,
      outletInfo || null,
    );
  }, [customerAddress, outletInfo]);

  const getLaundryItemById = (id: number) => {
    return laundryItems?.find((item) => item.id === id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async (values: FormValues) => {
    const payload = cleanPayload({
      totalWeight: hasPerKgItems(values.orderItems)
        ? values.totalWeight
        : values.totalWeight || 1,
      orderItems: values.orderItems.map((item) => ({
        laundryItemId: item.laundryItemId,
        quantity: item.quantity,
        weight: item.weight,
        color: item.color,
        brand: item.brand,
        materials: item.materials,
        orderItemDetails: item.orderItemDetails,
      })),
    });

    try {
      await processOrder({ orderId, payload });
    } catch (error) {}
  };

  if (isLoadingItems) {
    return (
      <div className="flex h-64 items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <span className="mt-2 block text-sm">Loading laundry items...</span>
        </div>
      </div>
    );
  }

  if (!laundryItems || laundryItems.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center px-2 sm:px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-lg font-medium text-red-600">
            Tidak ada item laundry tersedia
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Silakan hubungi administrator untuk menambahkan item laundry.
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-2 py-4 sm:px-4 md:px-6 lg:px-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue, isValid }) => {
          const laundrySubtotal = calculateLaundrySubtotal(values.orderItems);
          const estimatedTotal =
            laundrySubtotal +
            (deliveryEstimation.success ? deliveryEstimation.fee! : 0);
          const totalItems = values.orderItems.length;
          const hasPerKg = hasPerKgItems(values.orderItems);

          return (
            <Form className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Process Order
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Input total berat dan detail item laundry untuk pesanan
                    {orderNumber && ` #${orderNumber}`}
                    {customerName && ` - ${customerName}`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isProcessing}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-2">
                  {/* Total Weight */}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
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
                          <p className="text-sm text-red-500">
                            {errors.totalWeight}
                          </p>
                        )}

                        {!hasPerKg && values.orderItems.length > 0 && (
                          <p className="text-muted-foreground text-xs">
                            💡 Total berat opsional untuk item per pcs. Sistem
                            akan otomatis menggunakan berat default jika kosong.
                          </p>
                        )}
                        {hasPerKg && (
                          <p className="text-muted-foreground text-xs">
                            ⚠️ Total berat wajib diisi karena ada item dengan
                            pricing per kg.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Items */}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
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
                            {values.orderItems.length === 0 ? (
                              <div className="text-muted-foreground py-8 text-center">
                                <ShoppingBag className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p className="text-base">
                                  Belum ada item laundry
                                </p>
                                <p className="text-sm">
                                  Klik "Tambah Item" untuk menambah item
                                </p>
                              </div>
                            ) : (
                              values.orderItems.map((item, index) => {
                                const laundryItem = getLaundryItemById(
                                  item.laundryItemId,
                                );
                                const itemErrors = errors.orderItems?.[
                                  index
                                ] as any;
                                const itemTouched = touched.orderItems?.[
                                  index
                                ] as any;

                                return (
                                  <Card key={index} className="relative">
                                    <CardHeader className="pb-3 sm:pb-4">
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-base sm:text-lg">
                                          Item #{index + 1}
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
                                              <span className="sm:inline">
                                                Hapus
                                              </span>
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent className="mx-2 w-[calc(100vw-1rem)] max-w-md sm:mx-4 sm:w-[calc(100vw-2rem)]">
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                Hapus Item
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Apakah Anda yakin ingin
                                                menghapus item ini?
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
                                        <Label className="text-sm">
                                          Jenis Laundry *
                                        </Label>
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
                                            setFieldValue(
                                              `orderItems.${index}.quantity`,
                                              0,
                                            );
                                            setFieldValue(
                                              `orderItems.${index}.weight`,
                                              0,
                                            );
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
                                            {laundryItems?.map(
                                              (laundryItem) => (
                                                <SelectItem
                                                  key={laundryItem.id}
                                                  value={laundryItem.id.toString()}
                                                >
                                                  <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                    <span className="font-medium">
                                                      {laundryItem.name}
                                                    </span>
                                                    <div className="flex flex-col items-start gap-1 sm:ml-4 sm:items-end">
                                                      <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                      >
                                                        {laundryItem.category}
                                                      </Badge>
                                                      <div className="text-muted-foreground text-xs">
                                                        {formatCurrency(
                                                          laundryItem.basePrice,
                                                        )}
                                                        /
                                                        {laundryItem.pricingType ===
                                                        "PER_PIECE"
                                                          ? "pcs"
                                                          : "kg"}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </SelectItem>
                                              ),
                                            )}
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
                                          {laundryItem.pricingType ===
                                          "PER_PIECE" ? (
                                            <div className="space-y-2">
                                              <Label className="text-sm">
                                                Quantity (pcs) *
                                              </Label>
                                              <Field
                                                name={`orderItems.${index}.quantity`}
                                              >
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
                                              <Label className="text-sm">
                                                Berat (kg) *
                                              </Label>
                                              <Field
                                                name={`orderItems.${index}.weight`}
                                              >
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
                                              {itemErrors?.weight &&
                                                itemTouched?.weight && (
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
                                          <Label className="text-sm">
                                            Warna
                                          </Label>
                                          <Field
                                            name={`orderItems.${index}.color`}
                                          >
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
                                          <Label className="text-sm">
                                            Merk
                                          </Label>
                                          <Field
                                            name={`orderItems.${index}.brand`}
                                          >
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
                                          <Label className="text-sm">
                                            Bahan
                                          </Label>
                                          <Field
                                            name={`orderItems.${index}.materials`}
                                          >
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
                                                item.orderItemDetails.length >
                                                  0 && (
                                                  <div className="space-y-3">
                                                    {item.orderItemDetails.map(
                                                      (detail, detailIndex) => {
                                                        const detailErrors =
                                                          itemErrors
                                                            ?.orderItemDetails?.[
                                                            detailIndex
                                                          ];
                                                        const detailTouched =
                                                          itemTouched
                                                            ?.orderItemDetails?.[
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
                                                                {({
                                                                  field,
                                                                }: any) => (
                                                                  <Input
                                                                    {...field}
                                                                    value={
                                                                      field.value ||
                                                                      ""
                                                                    }
                                                                    placeholder="Contoh: Kemeja Putih"
                                                                    className={
                                                                      detailErrors?.name &&
                                                                      detailTouched?.name
                                                                        ? "border-red-500"
                                                                        : ""
                                                                    }
                                                                    disabled={
                                                                      isProcessing
                                                                    }
                                                                  />
                                                                )}
                                                              </Field>
                                                              {detailErrors?.name &&
                                                                detailTouched?.name && (
                                                                  <p className="text-xs text-red-500">
                                                                    {
                                                                      detailErrors.name
                                                                    }
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
                                                                {({
                                                                  field,
                                                                }: any) => (
                                                                  <Input
                                                                    {...field}
                                                                    value={
                                                                      field.value ||
                                                                      ""
                                                                    }
                                                                    type="number"
                                                                    min="1"
                                                                    className={
                                                                      detailErrors?.qty &&
                                                                      detailTouched?.qty
                                                                        ? "border-red-500"
                                                                        : ""
                                                                    }
                                                                    disabled={
                                                                      isProcessing
                                                                    }
                                                                  />
                                                                )}
                                                              </Field>
                                                              {detailErrors?.qty &&
                                                                detailTouched?.qty && (
                                                                  <p className="text-xs text-red-500">
                                                                    {
                                                                      detailErrors.qty
                                                                    }
                                                                  </p>
                                                                )}
                                                            </div>
                                                            <Button
                                                              type="button"
                                                              variant="outline"
                                                              size="sm"
                                                              onClick={() =>
                                                                removeDetail(
                                                                  detailIndex,
                                                                )
                                                              }
                                                              disabled={
                                                                isProcessing
                                                              }
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
                                                  laundryItem.pricingType ===
                                                    "PER_PIECE" &&
                                                    item.quantity > 0
                                                    ? laundryItem.basePrice *
                                                        item.quantity
                                                    : laundryItem.pricingType ===
                                                          "PER_KG" &&
                                                        item.weight > 0
                                                      ? laundryItem.basePrice *
                                                        item.weight
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

                      {errors.orderItems &&
                        typeof errors.orderItems === "string" && (
                          <p className="text-sm text-red-500">
                            {errors.orderItems}
                          </p>
                        )}
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Summary Sidebar */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <Card className="sticky top-4">
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
                            {values.totalWeight > 0
                              ? `${values.totalWeight} kg`
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
                            values.orderItems.length === 0
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

                  {/* Enhanced Info Card */}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="text-base">Info</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-2 pt-0 text-sm">
                      <p>
                        • Total berat <strong>opsional</strong> untuk item per
                        pcs, <strong>wajib</strong> untuk item per kg
                      </p>
                      <p>
                        • Pilih jenis item dan isi quantity/berat sesuai dengan
                        tipe pricing
                      </p>
                      <p>
                        • Detail item bersifat opsional untuk breakdown yang
                        lebih spesifik
                      </p>
                      <p>
                        • Ongkos kirim akan dihitung otomatis berdasarkan jarak
                        ke customer
                      </p>
                      <p>
                        • Setelah diproses, pesanan akan masuk ke tahap
                        pencucian
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
