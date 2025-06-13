"use client";

import { Button } from "@/components/ui/button";
import useGetLaundryItems from "@/hooks/api/order/useGetLaundryItems";
import useProcessOrder, {
  cleanPayload,
} from "@/hooks/api/order/useProcessOrder";
import { DistanceCalculator } from "@/utils/distanceCalculator";
import { Form, Formik } from "formik";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import * as Yup from "yup";

// Import komponen yang sudah dipisah
import { TotalWeightCard } from "./TotalWeightCard";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { InfoCard } from "./InfoCard";

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

  const { data: laundryItemsResponse, isLoading: isLoadingItems } =
    useGetLaundryItems();
  const { mutateAsync: processOrder, isPending: isProcessing } =
    useProcessOrder();

  // Handle berbagai format response
  const laundryItems = useMemo(() => {
    if (!laundryItemsResponse) return [];
    
    // Jika response langsung array
    if (Array.isArray(laundryItemsResponse)) {
      return laundryItemsResponse;
    }
    
    // Response dari backend sudah dalam format yang benar
    return laundryItemsResponse;
  }, [laundryItemsResponse]);

  // Debug log untuk melihat struktur data - hapus setelah selesai debug
  console.log('laundryItemsResponse:', laundryItemsResponse);
  console.log('laundryItems processed:', laundryItems, 'isArray:', Array.isArray(laundryItems));

  const initialValues: FormValues = {
    totalWeight: 0,
    orderItems: [],
  };

  const validationSchema = Yup.object({
    totalWeight: Yup.number()
      .min(0, "Total berat tidak boleh negatif")
      .when("orderItems", {
        is: (orderItems: ProcessOrderItem[]) => {
          // Tambahkan pengecekan untuk laundryItems
          if (!laundryItems || !Array.isArray(laundryItems)) return false;
          return orderItems.some((item) => {
            const laundryItem = laundryItems.find(
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
              // Tambahkan pengecekan untuk laundryItems
              if (!laundryItems || !Array.isArray(laundryItems)) return false;
              const laundryItem = laundryItems.find(
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
              // Tambahkan pengecekan untuk laundryItems
              if (!laundryItems || !Array.isArray(laundryItems)) return false;
              const laundryItem = laundryItems.find(
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
    // Tambahkan pengecekan null/undefined dan pastikan laundryItems adalah array
    if (!laundryItems || !Array.isArray(laundryItems)) return false;
    
    return orderItems.some((item) => {
      const laundryItem = laundryItems.find(
        (l) => l.id === item.laundryItemId,
      );
      return laundryItem?.pricingType === "PER_KG";
    });
  };

  const calculateLaundrySubtotal = (orderItems: ProcessOrderItem[]) => {
    // Tambahkan pengecekan null/undefined dan pastikan laundryItems adalah array
    if (!laundryItems || !Array.isArray(laundryItems)) return 0;

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
    // Tambahkan pengecekan null/undefined dan pastikan laundryItems adalah array
    if (!laundryItems || !Array.isArray(laundryItems)) return undefined;
    return laundryItems.find((item) => item.id === id);
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

  if (!laundryItems || !Array.isArray(laundryItems) || laundryItems.length === 0) {
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
                    onClick={() => router.back()}
                    disabled={isProcessing}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Pesanan
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-2">
                  {/* Total Weight Card */}
                  <TotalWeightCard
                    hasPerKg={hasPerKg}
                    totalWeight={values.totalWeight}
                    errors={errors}
                    touched={touched}
                    isProcessing={isProcessing}
                    orderItemsLength={values.orderItems.length}
                  />

                  {/* Order Items Card */}
                  <OrderItemsCard
                    orderItems={values.orderItems}
                    laundryItems={laundryItems}
                    errors={errors}
                    touched={touched}
                    isProcessing={isProcessing}
                    setFieldValue={setFieldValue}
                    getLaundryItemById={getLaundryItemById}
                    formatCurrency={formatCurrency}
                  />
                </div>

                {/* Enhanced Summary Sidebar */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div className="sticky top-4 space-y-3 sm:space-y-4 md:space-y-6">
                    {/* Order Summary Card */}
                    <OrderSummaryCard
                      totalWeight={values.totalWeight}
                      hasPerKg={hasPerKg}
                      totalItems={totalItems}
                      laundrySubtotal={laundrySubtotal}
                      estimatedTotal={estimatedTotal}
                      deliveryEstimation={deliveryEstimation}
                      isProcessing={isProcessing}
                      isValid={isValid}
                      orderItemsLength={values.orderItems.length}
                      formatCurrency={formatCurrency}
                    />

                    {/* Info Card */}
                    <InfoCard />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}