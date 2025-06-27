"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useGetDetailOrderByUuid from "@/hooks/api/employee/worker/useGetDetailOrderByUuid";
import useStartOrderProcess from "@/hooks/api/employee/worker/useStartOrderProcess";
import useFinishOrderProcess from "@/hooks/api/employee/worker/useFinishOrderProcess";
import useRequestBypass from "@/hooks/api/employee/worker/useRequestBypass";
import useFinishBypassProcess from "@/hooks/api/employee/worker/useFinishBypassProcess";
import {
  isValidWorkerType,
  workerConfigs,
  WorkerType,
} from "@/utils/OrderConfig";
import { Axios, AxiosError } from "axios";


interface UseProcessOrderLogicProps {
  uuid: string;
}

export interface VerificationItem {
  type: string;
  quantity: string;
}

export default function useProcessOrderLogic({
  uuid,
}: UseProcessOrderLogicProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const urlWorkerType = searchParams.get("station");
  const workerType: WorkerType = isValidWorkerType(urlWorkerType)
    ? urlWorkerType
    : "washing";
  const [hasReverified, setHasReverified] = useState(false);

  const [bypassRequest, setBypassRequest] = useState({ reason: "" });
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [processingNotes, setProcessingNotes] = useState("");
  const [verificationItems, setVerificationItems] = useState<
    VerificationItem[]
  >([{ type: "", quantity: "" }]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const currentBypassRequest = useMemo(() => {
    if (!orderData?.orderWorkProcess) return null;

    const workProcess = orderData.orderWorkProcess.find(
      (p) =>
        p.workerType.toLowerCase() === workerType.toLowerCase() &&
        p.bypassId &&
        !p.completedAt,
    );

    return workProcess?.bypass || null;
  }, [orderData, workerType]);

  const isVerificationCompleted = useMemo(() => {
    if (!orderData?.orderWorkProcess) return false;

    const currentWorkerProcess = orderData.orderWorkProcess.find(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );

    if (
      currentBypassRequest?.bypassStatus === "REJECTED" &&
      currentBypassRequest?.bypassProcess === "IN_PROGRESS"
    ) {
      return false;
    }

    if (
      currentBypassRequest?.bypassStatus === "REJECTED" &&
      currentBypassRequest?.bypassProcess === "RE_VERIFY"
    ) {
      return true;
    }

    return currentWorkerProcess && !currentWorkerProcess.completedAt;
  }, [orderData, workerType, currentBypassRequest]);

  const isProcessingCompleted = useMemo(() => {
    if (!orderData?.orderWorkProcess) return false;

    const currentWorkerProcess = orderData.orderWorkProcess.find(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );

    return currentWorkerProcess?.completedAt != null;
  }, [orderData, workerType]);

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

  const getCurrentStep = () => {
    if (isLoading) return "loading";
    if (!orderData) return "loading";

    const currentWorkerProcess = orderData.orderWorkProcess.find(
      (p) => p.workerType.toLowerCase() === workerType.toLowerCase(),
    );

    if (currentWorkerProcess?.completedAt) return "completed";

    if (currentBypassRequest) {
      switch (currentBypassRequest.bypassStatus) {
        case "PENDING":
          return "bypass_pending";
        case "REJECTED":
          switch (currentBypassRequest.bypassProcess) {
            case "IN_PROGRESS":
              return "bypass_rejected";
            case "RE_VERIFY":
              return "process";
            case "COMPLETED":
              return "completed";
            default:
              return "bypass_rejected";
          }
        case "APPROVED":
          return "process";
      }
    }

    if (currentWorkerProcess && !currentWorkerProcess.completedAt) {
      return "process";
    }

    return "verify";
  };

  const currentStep = getCurrentStep();
  const currentConfig = workerConfigs[workerType];

  const addVerificationItem = () =>
    setVerificationItems([...verificationItems, { type: "", quantity: "" }]);

  const updateVerificationItem = (
    index: number,
    field: keyof VerificationItem,
    value: string,
  ) => {
    const updated = [...verificationItems];
    updated[index] = { ...updated[index], [field]: value };
    setVerificationItems(updated);
  };

  const handleStartProcess = () => {
    const itemsData = verificationItems
      .filter((item) => item.type && item.quantity)
      .map((item) => ({
        laundryItemId:
          orderData?.orderItems.find(
            (orderItem) => orderItem.laundryItem.name === item.type,
          )?.laundryItem.id || 0,
        quantity: parseInt(item.quantity),
      }));
    const isReVerification = currentStep === "bypass_rejected";
    startOrderProcessMutation.mutate(
      { orderId: uuid, items: itemsData },
      {
        onSuccess: () => {
          if (isReVerification) {
            setHasReverified(true);
            toast.success("Items re-verified successfully!");
          } else {
            toast.success("Order process started successfully!");
          }
          queryClient.invalidateQueries({
            queryKey: ["WorkerOrderDetails", uuid],
          });
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || "Failed to start process.";
          if (message.includes("do not match") || message.includes("bypass")) {
            setShowBypassModal(true);
          }
        },
      },
    );
  };

  const handleSubmitBypass = () => {
    if (!bypassRequest.reason.trim()) {
      toast.error("Please provide a reason for the bypass request.");
      return;
    }
    setShowBypassModal(false);
    requestBypassMutation.mutate(
      { orderId: uuid, reason: bypassRequest.reason },
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
        },
        onError: (error: AxiosError<any>) =>
          toast.error(
            error?.response?.data?.message ||
              "Failed to submit bypass request.",
          ),
      },
    );
  };

  const handleCompleteOrder = () => {
    const itemsData = verificationItems
      .filter((item) => item.type && item.quantity)
      .map((item) => ({
        laundryItemId:
          orderData?.orderItems.find(
            (orderItem) => orderItem.laundryItem.name === item.type,
          )?.laundryItem.id || 0,
        quantity: parseInt(item.quantity),
      }));

    const isBypass = currentBypassRequest?.bypassStatus === "APPROVED";

    if (isBypass && currentBypassRequest?.id) {
      finishBypassOrderMutation.mutate(
        {
          bypassRequestId: currentBypassRequest.id,
          notes: processingNotes || undefined,
          items: itemsData,
        },
        {
          onSuccess: () => {
            toast.success(
              `Bypassed process completed at ${currentConfig.title}!`,
            );
            router.push(
              `/employee/orders/complete/${uuid}?station=${workerType}`,
            );
          },
          onError: (error: AxiosError<any>) =>
            toast.error(
              error?.response?.data?.message ||
                "Failed to Complete order bypass.",
            ),
        },
      );
    } else {
      finishOrderProcessMutation.mutate(
        { orderId: uuid, notes: processingNotes || undefined },
        {
          onSuccess: () => {
            toast.success(`Process completed at ${currentConfig.title}!`);
            router.push(
              `/employee/orders/complete/${uuid}?station=${workerType}`,
            );
          },
          onError: (error: AxiosError<any>) =>
            toast.error(
              error?.response?.data?.message || "Failed to Complete order.",
            ),
        },
      );
    }
  };

  const isCompletionInProgress =
    finishOrderProcessMutation.isPending || finishBypassOrderMutation.isPending;

  const isVerificationSectionDisabled = !(
    currentStep === "verify" || currentStep === "bypass_rejected"
  );

  const isProcessingSectionDisabled = !(
    currentStep === "process" && !isProcessingCompleted
  );

  return {
    isLoading,
    error,
    orderData,
    workerType,
    currentStep,
    currentConfig,
    currentBypassRequest,
    isVerificationCompleted,
    isProcessingCompleted,
    isCompletionInProgress,
    isVerificationSectionDisabled,
    isProcessingSectionDisabled,
    verificationItems,
    addVerificationItem,
    updateVerificationItem,
    handleStartProcess,
    isStartProcessPending: startOrderProcessMutation.isPending,
    processingNotes,
    setProcessingNotes,
    handleCompleteOrder,
    showBypassModal,
    setShowBypassModal,
    bypassRequest,
    setBypassRequest,
    handleSubmitBypass,
    isBypassRequestPending: requestBypassMutation.isPending,
  };
}
