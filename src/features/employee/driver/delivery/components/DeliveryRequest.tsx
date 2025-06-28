"use client";

import PaginationSection from "@/components/PaginationSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/features/employee/components/Loader";
import useClaimDelivery from "@/hooks/api/employee/driver/useClaimDelivery";
import useGetAvailableRequest from "@/hooks/api/employee/driver/useGetAvailableRequest";
import { format } from "date-fns";
import {
  Clock,
  Loader2,
  MapIcon,
  MapPin,
  Navigation,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import ErrorState from "../../components/ErrorState";
import MapModal from "../../components/MapModal";
import DeliveryRequestFilters from "./FilterDeliveryRequest";

export default function DeliveryRequestList() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [sortOrder] = useQueryState("sortOrder", { defaultValue: "desc" });
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [loadingRequestId, setLoadingRequestId] = useState<number | null>(null);
  const itemsPerPage = 4;

  const queryParams = {
    page: page,
    take: itemsPerPage,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: sortOrder,
    all: false,
    type: "delivery" as const,
  };

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAvailableRequest(queryParams);

  const claimDeliveryMutation = useClaimDelivery();
  const filteredRequests = apiResponse?.data || [];
  const totalPages = Math.ceil((apiResponse?.meta?.total || 0) / itemsPerPage);
  const totalElements = apiResponse?.meta?.total || 0;
  const hasNext = apiResponse?.meta?.hasNext || false;
  const hasPrevious = apiResponse?.meta?.hasPrevious || false;

  useEffect(() => {
    setPage(1);
  }, [search, sortOrder, setPage]);

  const handleClaimRequest = async (requestId: number) => {
    setLoadingRequestId(requestId);
    claimDeliveryMutation.mutate(requestId, {
      onSuccess: () => {
        toast.success("Successfully claimed delivery request");
        setLoadingRequestId(null);
      },
      onError: () => {
        setLoadingRequestId(null);
      },
    });
  };

  const handleCloseMapModal = () => {
    setSelectedRequest(null);
  };

  const handleNavigate = (coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    window.open(url, "_blank");
  };

  const handlePageReset = () => {
    setPage(1);
  };

  const DeliveryRequestCard = ({ request }: { request: any }) => (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {`${request.order.user.firstName} ${request.order.user.lastName}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {request.order.user.phoneNumber}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Delivery
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span>{format(new Date(request.createdAt), "MMM dd, h:mm a")}</span>
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{request.order.addressLine || "Address not provided"}</span>
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Order: </span>
          {request.order.orderNumber}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => handleClaimRequest(request.id)}
            disabled={loadingRequestId === request.id}
            className="flex-1"
          >
            {loadingRequestId === request.id ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : claimDeliveryMutation.isSuccess ? (
              "Claim Delivery"
            ) : (
              "Claim Delivery"
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleNavigate({
                latitude: request.order.latitude,
                longitude: request.order.longitude,
              })
            }
          >
            <Navigation className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedRequest(request)}
          >
            <MapIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingState = () => (
    <div>
      <Loader />
    </div>
  );

  return (
    <div className="p-3 md:p-4">
      <Card className="min-h-screen">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Package className="h-6 w-6" />
            Delivery Requests
          </CardTitle>
          <CardDescription>View and filter delivery jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryRequestFilters onPageReset={handlePageReset} />
        </CardContent>

        <div className="px-3 md:px-6">
          {!isLoading && !isError && (
            <div className="mb-3 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Showing {filteredRequests.length} of {totalElements} delivery
                requests
              </p>
              {totalPages > 0 && (
                <p className="text-muted-foreground text-sm">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>
          )}

          {isLoading ? (
            <LoadingState />
          ) : isError ? (
            <ErrorState
              errorMessage={error?.message}
              onRetry={() => refetch()}
            />
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <DeliveryRequestCard key={request.orderId} request={request} />
              ))}
            </div>
          ) : (
            <CardContent className="flex flex-col items-center justify-center">
              <Image
                src="/delivery-truck.svg"
                alt="No claimed orders"
                width={170}
                height={170}
                priority
                className="mb-2 h-35 w-35 opacity-70 md:h-50 md:w-50"
              />
              <h3 className="mb-2 text-xl font-semibold">
                No Delivery Request Yet
              </h3>
              <p className="text-muted-foreground max-w-sm text-center text-sm md:max-w-md">
                Please check back later, or if you've applied filters, try
                clearing them.
              </p>
            </CardContent>
          )}

          {(apiResponse?.meta?.total ?? 0) > itemsPerPage && (
            <div className="mt-8">
              <PaginationSection
                page={page}
                take={itemsPerPage}
                total={apiResponse?.meta.total || 0}
                onChangePage={setPage}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
              />
            </div>
          )}
        </div>

        <MapModal
          selectedRequest={selectedRequest}
          onClose={handleCloseMapModal}
          onNavigate={handleNavigate}
        />
      </Card>
    </div>
  );
}
