"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useProcessOrderLogic from "@/hooks/api/employee/worker/useProcessOrder";
import ProcessOrderHeader from "./ProcessOrderHeader";
import ProgressSteps from "./ProgressStep";
import BypassAlert from "./BypassAlert";
import OriginalOrderItems from "./OriginalOrderItem";
import ItemVerificationCard from "./ItemVerificationCard";
import ProcessingCard from "./ProcessingCard";
import BypassRequestModal from "./BypassReqModal";
import Loader from "@/features/employee/components/Loader";

interface ProcessOrderProps {
  uuid: string;
}

export default function ProcessOrderDetailPage({ uuid }: ProcessOrderProps) {
  const {
    isLoading,
    error,
    orderData,
    currentStep,
    currentConfig,
    currentBypassRequest,
    isVerificationCompleted,
    isProcessingCompleted,
    isVerificationSectionDisabled,
    isProcessingSectionDisabled,
    verificationItems,
    addVerificationItem,
    updateVerificationItem,
    handleStartProcess,
    isStartProcessPending,
    processingNotes,
    setProcessingNotes,
    handleCompleteOrder,
    isCompletionInProgress,
    showBypassModal,
    setShowBypassModal,
    bypassRequest,
    setBypassRequest,
    handleSubmitBypass,
    isBypassRequestPending,
  } = useProcessOrderLogic({ uuid });

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Error Loading Order</h2>
          <p className="text-gray-600">
            Unable to load details. Please try again.
          </p>
          <Link href="/worker/dashboard" className="mt-4 inline-block">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full md:p-6">
      <Card>
        <ProcessOrderHeader
          orderData={orderData}
          currentConfig={currentConfig}
        />

        <div className="mx-auto w-full space-y-6 p-4">
          <ProgressSteps
            currentStep={currentStep}
            isVerificationCompleted={isVerificationCompleted ?? false}
            isProcessingCompleted={isProcessingCompleted ?? false}
          />

          {currentBypassRequest && (
            <BypassAlert request={currentBypassRequest} />
          )}

          <OriginalOrderItems items={orderData.orderItems} />

          <ItemVerificationCard
            orderData={orderData}
            verificationItems={verificationItems}
            updateVerificationItem={updateVerificationItem}
            addVerificationItem={addVerificationItem}
            handleStartProcess={handleStartProcess}
            isDisabled={isVerificationSectionDisabled}
            isPending={isStartProcessPending}
            isCompleted={isVerificationCompleted ?? false}
            bypassStatus={currentBypassRequest?.bypassStatus}
          />

          <ProcessingCard
            currentConfig={currentConfig}
            notes={processingNotes}
            setNotes={setProcessingNotes}
            onComplete={handleCompleteOrder}
            isDisabled={isProcessingSectionDisabled}
            isPending={isCompletionInProgress}
            isCompleted={isProcessingCompleted}
            paymentStatus={orderData.paymentStatus}
          />
        </div>
      </Card>

      {showBypassModal && (
        <BypassRequestModal
          isOpen={showBypassModal}
          onClose={() => setShowBypassModal(false)}
          reason={bypassRequest.reason}
          setReason={(reason) => setBypassRequest({ reason })}
          onSubmit={handleSubmitBypass}
          isPending={isBypassRequestPending}
        />
      )}
    </div>
  );
}
