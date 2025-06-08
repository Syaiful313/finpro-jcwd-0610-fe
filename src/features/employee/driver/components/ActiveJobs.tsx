"use client";

import React from "react";
import { TruckIcon, Box, MapPin, Loader2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import useGetActiveJobs from "@/hooks/api/employee/driver/useGetActiveJob";

const ActiveJobs = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Use the hook to fetch active jobs with "active" status
  const {
    data: activeJobsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetActiveJobs({ status: "active" });
  console.log("activeJobsData", activeJobsData);

  // Extract requests from the pageable response
  const requests = activeJobsData?.data || [];
  const totalRequests = activeJobsData?.meta?.total || 0;

  const handleViewDetails = (id: number) => {
    console.log(`Viewing details for request ${id}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <section>
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
            <TruckIcon className="h-5 w-5" />
            Claimed Request
          </div>
          <p className="text-muted-foreground">
            View your recent claimed requests here
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">
            Loading claimed requests...
          </span>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section>
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
            <TruckIcon className="h-5 w-5" />
            Claimed Request
          </div>
          <p className="text-muted-foreground">
            View your recent claimed requests here
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-red-500">
            <TruckIcon className="h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Failed to Load Requests
          </h3>
          <p className="mb-6 max-w-md text-gray-600">
            {error?.message ||
              "Something went wrong while loading your claimed requests."}
          </p>
          <Button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
              <TruckIcon className="h-5 w-5" />
              Claimed Request
            </div>
            <p className="text-muted-foreground">
              View your recent claimed requests here
              {totalRequests > 0 && (
                <span className="ml-1">({totalRequests} total)</span>
              )}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Image
              src="/delivery-truck.svg"
              alt="No claimed orders"
              width={170}
              height={170}
              className="mb-6 bg-contain opacity-70"
            />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Claimed Orders Yet
            </h3>
            <p className="mb-6 max-w-md text-gray-600">
              You haven't claimed any orders yet. Start by claiming an order to
              begin your delivery journey.
            </p>
            <button className="rounded-md bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Claim Orders
            </button>
          </div>
        ) : isMobile ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.order.orderNumber}
                className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {`${request.order.user.firstName} ${request.order.user.lastName}` ||
                      "Unknown Customer"}
                  </h3>
                  <button
                    onClick={() => handleViewDetails(request.id)}
                    className="rounded-md border border-blue-500 px-3 py-1 text-sm text-blue-500 transition-colors hover:bg-blue-50"
                    aria-label={`View details for ${request.order.user.firstName || "customer"}'s order`}
                  >
                    View Details
                  </button>
                </div>

                <div className="mb-2 flex items-center text-xs text-gray-600">
                  <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="items-center text-xs">
                    {request.order.address_line ||
                      request.order.city ||
                      request.order.district ||
                      "Location not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <div className="mt-2">
                      <Badge
                        variant={
                          request.jobType === "pickup" ? "default" : "secondary"
                        }
                        className="flex items-center gap-1 text-xs"
                      >
                        {request.jobType === "pickup" ? <TruckIcon /> : <Box />}
                        {request.jobType || "Delivery"}
                      </Badge>
                    </div>
                    {request.status && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Status: {request.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {request.order.totalWeight || 0} Kg
                  </span>
                </div>

                {/* Additional info if available */}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full table-auto border border-gray-200 bg-white">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Order Type
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-2 py-4 text-left text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr
                    key={request.order.orderNumber}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-2 py-4 text-xs font-medium text-gray-900">
                      {`${request.order.user.firstName} ${request.order.user.lastName}` ||
                        "Unknown Customer"}
                    </td>
                    <td className="px-2 py-4 text-xs text-gray-600">
                      <div className="line-clamp-1 flex items-center">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        {request.order.address_line ||
                          request.order.city ||
                          request.order.district ||
                          "Location not specified"}
                      </div>
                    </td>
                    <td className="px-2 py-4 text-sm">
                      <Badge
                        variant={
                          request.jobType === "pickup" ? "default" : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {request.jobType === "pickup" ? (
                          <TruckIcon className="h-3 w-3" />
                        ) : (
                          <Box className="h-3 w-3" />
                        )}
                        {request.jobType || "Delivery"}
                      </Badge>
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-600">
                      {request.order.totalWeight || 0} Kg
                    </td>
                    <td className="px-2 py-4 text-sm">
                      {request.status && (
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                      )}
                    </td>
                    <td className="px-2 py-4">
                      <Button
                        onClick={() => handleViewDetails(request.id)}
                        variant="link"
                        aria-label={`View details for ${request.order.user.firstName || "customer"}'s order`}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveJobs;
