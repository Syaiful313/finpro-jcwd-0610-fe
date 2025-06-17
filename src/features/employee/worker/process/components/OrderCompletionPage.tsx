"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shirt,
  Sparkles,
  Box,
  Truck,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import useGetDetailOrderByUuid from "@/hooks/api/employee/worker/useGetDetailOrderByUuid";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useBreadcrumb } from "@/features/employee/components/BreadCrumbContext";

type WorkerType = "washing" | "ironing" | "packing";

export default function OrderCompletionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setBreadcrumbs } = useBreadcrumb();
  const uuid = params.uuid as string;
  const station = searchParams.get("station") as WorkerType;

  const { data: orderData, isLoading, error } = useGetDetailOrderByUuid(uuid);
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "completed" },
    ]);
  }, [setBreadcrumbs]);
  const workerConfigs = {
    washing: {
      title: "Washing Station",
      icon: Shirt,
      nextTitle: "Ready for Ironing",
    },
    ironing: {
      title: "Ironing Station",
      icon: Sparkles,
      nextTitle: "Ready for Packing",
    },
    packing: {
      title: "Packing Station",
      icon: Box,
      nextTitle: "Ready for Delivery",
    },
  };

  const currentConfig = workerConfigs[station] || {
    title: "Process",
    icon: CheckCircle,
    nextTitle: "Next Stage",
  };
  const IconComponent = currentConfig.icon;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading confirmation...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>
          Error loading order data.{" "}
          <Link href="/employee" className="underline">
            Go to Dashboard
          </Link>
        </p>
      </div>
    );
  }

  const handleNavigate = async (path: string) => {
    await queryClient.invalidateQueries();
    router.push(path);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="text-primary mx-auto mb-4 h-16 w-16" />

          <h2 className="mb-2 text-xl font-semibold">
            {currentConfig.title} Process Completed!
          </h2>

          <p className="mb-4 text-gray-600">
            Order #{orderData.orderNumber} has been processed successfully.
          </p>

          {station === "packing" &&
          orderData.paymentStatus === "WAITING_PAYMENT" ? (
            <Badge
              variant="secondary"
              className="flex items-center justify-center gap-2 bg-amber-100 p-2 text-sm text-amber-800"
            >
              <CreditCard className="h-4 w-4" />
              Waiting for Customer Payment
            </Badge>
          ) : (
            <Badge className="bg-primary flex items-center justify-center gap-2 p-2 text-sm text-white">
              {station === "packing" ? (
                <Truck className="h-4 w-4" />
              ) : (
                <IconComponent className="h-4 w-4" />
              )}
              {currentConfig.nextTitle}
            </Badge>
          )}

          <div className="mt-2 text-sm text-gray-600">
            Customer: {orderData.user.firstName} {orderData.user.lastName} (
            {orderData.user.phoneNumber})
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleNavigate("/employee")}
            >
              Back to Dashboard
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleNavigate("/employee/orders")}
            >
              View Order Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
