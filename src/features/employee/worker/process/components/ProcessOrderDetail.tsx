"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFinishBypassProcess from "@/hooks/api/employee/worker/useFinishBypassProcess";
import useFinishOrderProcess from "@/hooks/api/employee/worker/useFinishOrderProcess";
import useGetDetailOrderByUuid from "@/hooks/api/employee/worker/useGetDetailOrderByUuid";
import useRequestBypass from "@/hooks/api/employee/worker/useRequestBypass";
import useStartOrderProcess from "@/hooks/api/employee/worker/useStartOrderProcess";
import { formatDate } from "@/utils/formatDate";
import { useQueryClient } from "@tanstack/react-query";
import { log } from "console";
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  CheckCircle,
  Clock,
  CreditCard,
  Phone,
  Shirt,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProcessOrderProps {
  uuid: string;
}

export default function ProcessOrderDetail({ uuid }: ProcessOrderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const urlWorkerType = searchParams.get("station");
  const [bypassRequest, setBypassRequest] = useState({
    reason: "",
  });
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [processingNotes, setProcessingNotes] = useState("");
  const [verificationItems, setVerificationItems] = useState([
    { type: "", quantity: "" },
  ]);
  const [isInitialized, setIsInitialized] = useState(false);

  const isValidWorkerType = (
    type: string | null,
  ): type is "washing" | "ironing" | "packing" => {
    return type === "washing" || type === "ironing" || type === "packing";
  };
  const workerType: "washing" | "ironing" | "packing" = isValidWorkerType(
    urlWorkerType,
  )
    ? urlWorkerType
    : "washing";
  useEffect(() => {
    console.log(
      "ProcessOrderDetail: URL searchParams:",
      searchParams.toString(),
    );
    console.log("ProcessOrderDetail: Read workerType from URL:", urlWorkerType);
    console.log("ProcessOrderDetail: Final workerType variable:", workerType);
  }, [searchParams, urlWorkerType, workerType]);
  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetDetailOrderByUuid(uuid);

  const startOrderProcessMutation = useStartOrderProcess();
  const finishOrderProcessMutation = useFinishOrderProcess();
  const requestBypassMutation = useRequestBypass();
  const finishBypassOrderMutation = useFinishBypassProcess();
  const currentBypassRequest = orderData?.orderWorkProcess.find(
    (p) =>
      p.workerType.toLowerCase() === workerType.toLowerCase() && p.bypassId,
  )?.bypass;

  const isVerificationCompleted = () => {
    if (!orderData?.orderWorkProcess) return false;
    return orderData.orderWorkProcess.some(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );
  };

  const isProcessingCompleted = () => {
    if (!orderData?.orderWorkProcess) return false;

    if (currentBypassRequest?.bypassStatus === "APPROVED") {
      return false;
    }

    const currentWorkerProcess = orderData.orderWorkProcess.find(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );
    return currentWorkerProcess?.completedAt != null;
  };

  useEffect(() => {
    if (orderData?.orderItems && !isInitialized) {
      const initialItems = orderData.orderItems.map((item) => ({
        type: item.laundryItem.name,
        quantity: item.quantity.toString(),
      }));
      setVerificationItems(initialItems);
      setIsInitialized(true);
    }
  }, [orderData, isInitialized]);

  const addVerificationItem = () => {
    setVerificationItems([...verificationItems, { type: "", quantity: "" }]);
  };

  const updateVerificationItem = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...verificationItems];
    updated[index] = { ...updated[index], [field]: value };
    setVerificationItems(updated);
  };

  const getCurrentStep = () => {
    if (isLoading) return "loading";
    if (!orderData) return "loading";

    const currentWorkerProcess = orderData.orderWorkProcess.find(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );

    if (currentBypassRequest) {
      if (currentBypassRequest.bypassStatus === "PENDING") {
        return "bypass_pending";
      }
      if (currentBypassRequest.bypassStatus === "REJECTED") {
        return "bypass_rejected";
      }

      if (currentBypassRequest.bypassStatus === "APPROVED") {
        return "process";
      }
    }

    if (currentWorkerProcess?.completedAt) {
      return "completed";
    }

    if (currentWorkerProcess) {
      return "process";
    }

    return "verify";
  };

  const currentStep = getCurrentStep();

  useEffect(() => {
    if (currentStep === "completed") {
    }
  }, [currentStep, router, uuid, workerType]);

  const workerConfigs = {
    washing: {
      title: "Washing Station",
      icon: Shirt,
      nextStage: "ironing",
      nextTitle: "Ready for Ironing",
      color: "blue",
      processLabel: "Washing Type",
    },
    ironing: {
      title: "Ironing Station",
      icon: Sparkles,
      nextStage: "packing",
      nextTitle: "Ready for Packing",
      color: "purple",
      processLabel: "Ironing Type",
    },
    packing: {
      title: "Packing Station",
      icon: Box,
      nextStage: "delivery",
      nextTitle: "Ready for Delivery",
      color: "green",
      processLabel: "Packaging Type",
    },
  };

  const currentConfig = workerConfigs[workerType];
  const IconComponent = currentConfig.icon;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold">Error Loading Order</h2>
            <p className="text-gray-600">
              Unable to load order details. Please try again.
            </p>
            <Link href="/worker/dashboard" className="mt-4 inline-block">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkForMismatches = async () => {
    const itemsData = verificationItems
      .filter((item) => item.type && item.quantity)
      .map((item) => {
        const originalItem = orderData.orderItems.find(
          (orderItem) => orderItem.laundryItem.name === item.type,
        );
        return {
          laundryItemId: originalItem?.laundryItem.id || 0,
          quantity: parseInt(item.quantity),
        };
      });

    startOrderProcessMutation.mutate(
      {
        orderId: orderData.uuid,
        items: itemsData,
      },
      {
        onSuccess: () => {
          toast.success("Order process started successfully!");
          queryClient.invalidateQueries({
            queryKey: ["WorkerOrderDetails", uuid],
          });
          setTimeout(() => {
            refetch();
          }, 500);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to start order process. Please try again.";

          if (
            errorMessage.includes("do not match") ||
            errorMessage.includes("bypass")
          ) {
            toast.error("Item quantities do not match original order.");
            setShowBypassModal(true);
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  const submitBypassRequest = async () => {
    if (!bypassRequest.reason.trim()) {
      toast.error("Please provide a reason for the bypass request.");
      return;
    }
    setShowBypassModal(false);
    requestBypassMutation.mutate(
      {
        orderId: orderData.uuid,
        reason: bypassRequest.reason,
      },
      {
        onSuccess: () => {
          toast.success("Bypass request submitted successfully!");
          setBypassRequest({ reason: "" });
          queryClient.invalidateQueries({
            queryKey: ["WorkerOrderDetails", uuid],
          });
          queryClient.invalidateQueries({
            queryKey: ["ListOfBypass"],
            exact: false,
          });
          setTimeout(() => {
            refetch();
          }, 500);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to submit bypass request. Please try again.";
          toast.error(errorMessage);
        },
      },
    );
  };

  const completeOrder = async () => {
    console.log("Mengecek data untuk bypass:", currentBypassRequest);
    const itemsData = verificationItems
      .filter((item) => item.type && item.quantity)
      .map((item) => {
        const originalItem = orderData.orderItems.find(
          (orderItem) => orderItem.laundryItem.name === item.type,
        );
        return {
          laundryItemId: originalItem?.laundryItem.id || 0,
          quantity: parseInt(item.quantity),
        };
      });

    const isBypassCompletion =
      currentBypassRequest?.bypassStatus === "APPROVED";
    console.log("Apakah statusnya APPROVED?", isBypassCompletion);
    console.log("Apakah ada ID?", currentBypassRequest?.id);

    if (isBypassCompletion && currentBypassRequest?.id) {
      finishBypassOrderMutation.mutate(
        {
          bypassRequestId: currentBypassRequest.id,
          notes: processingNotes || undefined,
          items: itemsData,
        },
        {
          onSuccess: () => {
            toast.success(
              `Bypassed order process completed at ${currentConfig.title}!`,
            );
            queryClient.invalidateQueries({
              queryKey: ["WorkerStationOrder", uuid],
            });
            queryClient.invalidateQueries({
              queryKey: ["WorkerOrderDetails", uuid],
            });

            router.push(
              `/employee/orders/complete/${uuid}?station=${workerType}`,
            );
          },
          onError: (error: any) => {
            console.error("❌ GAGAL MENYELESAIKAN BYPASS ORDER:", error);

            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "An unknown error occurred. Please check the console.";

            toast.error(errorMessage);
          },
        },
      );
    } else {
      finishOrderProcessMutation.mutate(
        {
          orderId: orderData.uuid,
          notes: processingNotes || undefined,
        },
        {
          onSuccess: () => {
            toast.success(`Order process completed at ${currentConfig.title}!`);
            queryClient.invalidateQueries({
              queryKey: ["WorkerStationOrder", uuid],
            });
            queryClient.invalidateQueries({
              queryKey: ["WorkerOrderDetails", uuid],
            });

            router.push(
              `/employee/orders/complete/${uuid}?station=${workerType}`,
            );
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message;
            toast.error(errorMessage);
            console.log("Error completing order process:", errorMessage);
          },
        },
      );
    }
  };
  const isCompletionInProgress =
    finishOrderProcessMutation.isPending || finishBypassOrderMutation.isPending;

  const isVerificationSectionDisabled =
    currentStep === "process" ||
    currentStep === "completed" ||
    currentStep === "bypass_pending" ||
    currentStep === "bypass_rejected";

  const isProcessingSectionDisabled =
    currentStep === "verify" ||
    currentStep === "completed" ||
    currentStep === "bypass_pending" ||
    currentStep === "bypass_rejected";

  console.log("🛑 DEBUG STATUS TOMBOL COMPLETE 🛑");
  console.log({
    "Nilai `currentStep` sekarang": currentStep,
    "HASIL KONDISI 1 (currentStep !== 'process')": currentStep !== "process",

    "Nilai `isProcessingCompleted()` sekarang": isProcessingCompleted(),
    "HASIL KONDISI 2 (isProcessingCompleted())": isProcessingCompleted(),

    "Nilai `isCompletionInProgress` sekarang": isCompletionInProgress,
    "HASIL KONDISI 3 (isCompletionInProgress)": isCompletionInProgress,

    "👉 HASIL AKHIR (Tombol Disabled?)":
      currentStep !== "process" ||
      isProcessingCompleted() ||
      isCompletionInProgress,
  });
  console.log("----------------------------------------------------");
  return (
    <div className="min-h-screen w-full md:p-6">
      <Card className="md:block">
        {/* Debug Information - Remove in production */}
        {/* <div className="-mt-6 bg-yellow-100 p-2 text-xs">
          <strong>Debug:</strong> Current Step: {currentStep} | Worker Type:{" "}
          {workerType} | Work Processes Count:{" "}
          {orderData?.orderWorkProcess?.length || 0} | Verification Completed:{" "}
          {isVerificationCompleted() ? "Yes" : "No"} | Processing Completed:{" "}
          {isProcessingCompleted() ? "Yes" : "No"}
        </div> */}

        {/* Header */}
        <header className="sticky top-0 z-50 -mt-6 overflow-hidden rounded-t-xl border-b bg-white shadow-sm md:relative md:shadow-none">
          <div className="flex items-center gap-3 p-4">
            <Button
              variant="ghost"
              size="icon"
              className="block md:hidden"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                Process Order #{orderData.orderNumber} - {currentConfig.title}
              </h1>
              <div className="flex flex-col gap-1 text-sm text-gray-600 md:flex-row md:items-center md:gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {orderData.user.firstName} {orderData.user.lastName}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {orderData.user.phoneNumber}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full space-y-6 p-4">
          {/* Progress Steps - Fixed to show correct current station steps */}
          <div className="mb-6 flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${
                currentStep === "verify"
                  ? "text-blue-600"
                  : isVerificationCompleted()
                    ? "text-blue-600"
                    : "text-gray-400"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep === "verify"
                    ? "bg-blue-600 text-white"
                    : isVerificationCompleted()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                }`}
              >
                {isVerificationCompleted() ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  "1"
                )}
              </div>
              <span className="text-sm font-medium">Verify</span>
            </div>
            <div
              className={`mx-4 h-1 flex-1 ${
                currentStep === "process" || isProcessingCompleted()
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center gap-2 ${
                currentStep === "process"
                  ? "text-blue-600"
                  : isProcessingCompleted()
                    ? "text-blue-600"
                    : "text-gray-400"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  currentStep === "process"
                    ? "bg-blue-600 text-white"
                    : isProcessingCompleted()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                }`}
              >
                {isProcessingCompleted() ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-sm font-medium">Process </span>
            </div>
            <div
              className={`mx-4 h-1 flex-1 ${
                isProcessingCompleted() ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center gap-2 ${
                isProcessingCompleted() ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isProcessingCompleted()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {isProcessingCompleted() ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  "3"
                )}
              </div>
              <span className="text-sm font-medium">Complete</span>
            </div>
          </div>

          {/* Display Alerts for Bypass Status */}
          {currentBypassRequest && (
            <Alert
              className={
                currentBypassRequest.bypassStatus === "PENDING"
                  ? "border-orange-500 bg-orange-50"
                  : currentBypassRequest.bypassStatus === "APPROVED"
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
              }
            >
              {currentBypassRequest.bypassStatus === "PENDING" && (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
              {currentBypassRequest.bypassStatus === "APPROVED" && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {currentBypassRequest.bypassStatus === "REJECTED" && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>
                Bypass Request Status: {currentBypassRequest.bypassStatus}
              </AlertTitle>
              <AlertDescription>
                Reason: {currentBypassRequest.reason}
                {currentBypassRequest.adminNote && (
                  <>
                    <br />
                    Admin Note: {currentBypassRequest.adminNote}
                  </>
                )}
                {currentBypassRequest.bypassStatus === "PENDING" && (
                  <p className="mt-2 text-sm">
                    Waiting for Outlet Admin approval to proceed.
                  </p>
                )}
                {currentBypassRequest.bypassStatus === "REJECTED" && (
                  <p className="mt-2 text-sm font-semibold">
                    Bypass request was rejected. Please re-verify items
                    correctly or request a new bypass.
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute top-[5px] left-[5px] h-full w-px bg-gray-300"></div>

                <div className="space-y-0">
                  {/* Order Placed */}
                  <div className="relative flex items-start gap-4 pb-6">
                    <div className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full bg-gray-400"></div>
                    <div className="-mt-1 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium">Order Placed</div>
                          <div className="text-sm text-gray-600">
                            Order created and confirmed
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(orderData.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full bg-gray-400"></div>
                    <div className="-mt-1 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-medium">Last Updated</div>
                          <div className="text-sm text-gray-600">
                            Order status updated
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(orderData.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Original Order Items - Always show */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-6 w-6" />
                Original Order Items
              </CardTitle>
              <CardDescription>
                Items as listed in the original order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderData.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.laundryItem.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} • {item.laundryItem.category} • Rp{" "}
                      {item.pricePerUnit.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="font-medium">
                      Rp {item.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Step 1: Item Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === "completed" || currentStep === "process" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                Item Verification
                {isVerificationCompleted() && (
                  <Badge variant="default" className="ml-2">
                    Completed
                  </Badge>
                )}
                {currentBypassRequest?.bypassStatus === "PENDING" && (
                  <Badge
                    variant="outline"
                    className="ml-2 border-orange-300 bg-orange-100 text-orange-700"
                  >
                    Bypass Pending
                  </Badge>
                )}
                {currentBypassRequest?.bypassStatus === "REJECTED" && (
                  <Badge
                    variant="outline"
                    className="ml-2 border-red-300 bg-red-100 text-red-700"
                  >
                    Bypass Rejected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {currentStep === "completed" || currentStep === "process"
                  ? "Items have been verified and processing can begin"
                  : "Please verify all items before proceeding to processing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationItems.map((item, index) => (
                <div key={index} className="w-full rounded-lg border p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2.5">
                      <Label>Item Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value) =>
                          updateVerificationItem(index, "type", value)
                        }
                        disabled={isVerificationCompleted()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderData.orderItems.map((orderItem) => (
                            <SelectItem
                              key={orderItem.id}
                              value={orderItem.laundryItem.name}
                            >
                              {orderItem.laundryItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateVerificationItem(
                            index,
                            "quantity",
                            e.target.value,
                          )
                        }
                        placeholder="0"
                        className="w-full"
                        disabled={isVerificationCompleted()}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addVerificationItem}
                  className="flex-1"
                  disabled={isVerificationSectionDisabled}
                >
                  {isVerificationCompleted() ? "Items Verified" : "Add Item"}
                </Button>
                <Button
                  onClick={checkForMismatches}
                  className="flex-1"
                  disabled={
                    startOrderProcessMutation.isPending ||
                    isVerificationSectionDisabled
                  }
                >
                  {isVerificationCompleted()
                    ? "Verification Complete"
                    : startOrderProcessMutation.isPending
                      ? "Processing..."
                      : "Verify Items"}
                </Button>
              </div>

              {isVerificationCompleted() && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    Items have been successfully verified. You can now proceed
                    to {workerType} processing.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isProcessingCompleted() ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <IconComponent
                    className={`h-5 w-5 ${
                      currentStep === "process"
                        ? `text-${currentConfig.color}-500`
                        : "text-gray-400"
                    }`}
                  />
                )}
                {currentConfig.title}
                {isProcessingCompleted() && (
                  <Badge variant="default" className="ml-2">
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isProcessingCompleted()
                  ? `${currentConfig.title} process has been completed`
                  : currentStep === "process"
                    ? `Complete the ${workerType} process`
                    : `Waiting for item verification to complete before processing`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Status Check */}
              <Alert
                className={
                  orderData.paymentStatus === "PAID"
                    ? "border-green-500 bg-green-50"
                    : "border-amber-500 bg-amber-50"
                }
              >
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Payment Status:{" "}
                  <Badge
                    variant={
                      orderData.paymentStatus === "PAID"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {orderData.paymentStatus === "PAID"
                      ? "Paid"
                      : "Waiting for Payment"}
                  </Badge>
                </AlertDescription>
              </Alert>

              <div>
                <Label>Processing Notes</Label>
                <Textarea
                  placeholder={`Add any ${workerType} process notes...`}
                  value={processingNotes}
                  onChange={(e) => setProcessingNotes(e.target.value)}
                  disabled={isProcessingSectionDisabled}
                />
              </div>

              <Button
                onClick={completeOrder}
                className="w-full"
                disabled={
                  currentStep !== "process" ||
                  isProcessingCompleted() ||
                  isCompletionInProgress
                }
              >
                {isProcessingCompleted()
                  ? "Process Completed"
                  : isCompletionInProgress
                    ? "Completing..."
                    : `Complete ${currentConfig.title}`}
              </Button>

              {isProcessingCompleted() && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {currentConfig.title} process has been successfully
                    completed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bypass Request Modal */}
          {showBypassModal && (
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    Item Quantity Mismatch
                  </CardTitle>
                  <CardDescription>
                    The quantities you entered don't match the original order.
                    Please request a bypass to proceed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Reason for Discrepancy</Label>
                    <Textarea
                      placeholder="Explain why the quantities don't match (e.g., damaged items, missing items, etc.)..."
                      value={bypassRequest.reason}
                      onChange={(e) =>
                        setBypassRequest((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowBypassModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitBypassRequest}
                      className="flex-1"
                      disabled={
                        requestBypassMutation.isPending ||
                        !bypassRequest.reason.trim()
                      }
                    >
                      {requestBypassMutation.isPending
                        ? "Submitting Bypass..."
                        : "Request Bypass"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
