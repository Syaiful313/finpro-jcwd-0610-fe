"use client";

import React from "react";
import { useParams } from "next/navigation";

import { DriverJobResponse } from "@/types/detailApi";
import useGetOrderByUuid from "@/hooks/api/employee/driver/useGetOrderByUuid";
import JobDetails from "./components/DetailOrderDriver";

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-2 text-gray-600">Loading order details...</p>
    </div>
  </div>
);

const ErrorDisplay = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md text-center">
      <div className="mb-4 text-red-500">
        <svg
          className="mx-auto h-16 w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-800">
        Error Loading Order
      </h2>
      <p className="mb-4 text-gray-600">
        {error.message ||
          "Something went wrong while loading the order details."}
      </p>
      <button
        onClick={onRetry}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        Try Again
      </button>
    </div>
  </div>
);

const IndexTry = () => {
  const params = useParams();
  const uuid = params?.uuid as string;

  const {
    data: orderData,
    isLoading,
    error,
    refetch,
  } = useGetOrderByUuid(uuid || "");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error as Error} onRetry={() => refetch()} />;
  }

  if (!orderData) {
    return (
      <ErrorDisplay
        error={new Error("Order not found")}
        onRetry={() => refetch()}
      />
    );
  }

  const jobData = orderData as DriverJobResponse;

  return <JobDetails jobData={jobData} />;
};

export default IndexTry;
