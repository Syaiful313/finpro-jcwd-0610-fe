"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetAvailableRequest from "@/hooks/api/employee/driver/useGetAvailableRequest";
import { format, set } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapIcon,
  MapPin,
  Navigation,
  Package,
  Phone,
  Search,
  SortAsc,
  SortDesc,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import MapModal from "./MapModal";
import { parseAsInteger, useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";
import PaginationSection from "@/components/PaginationSection";
import useClaimPickUp from "@/hooks/api/employee/driver/useClaimPickUp";
import { toast } from "sonner";
import ErrorState from "./ErrorState";
import useClaimDelivery from "@/hooks/api/employee/driver/useClaimDelivery";

export default function RequestList() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [activeTab, setActiveTab] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [showMap, setShowMap] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const itemsPerPage = 4;
  const driverBusy = false; // Mock driver status - you might want to fetch this from another API
  const orderLimit = 5; // Mock order limit - you might want to fetch this from another API
  const currentOrders = 2; // Mock current orders - you might want to fetch this from another API

  // Build query parameters for the API
  const queryParams = {
    page: page, // Your API uses 1-based indexing
    take: itemsPerPage,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: sortOrder,
    all: false,
  };

  const typeFilter =
    activeTab === "All"
      ? "all"
      : (activeTab.toLowerCase() as "pickup" | "delivery");

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAvailableRequest({ ...queryParams, type: typeFilter });
  const claimPickUpMutation = useClaimPickUp();
  const claimDeliveryMutation = useClaimDelivery();
  const filteredRequests = apiResponse?.data || [];
  const totalPages = Math.ceil((apiResponse?.meta?.total || 0) / itemsPerPage);
  const totalElements = apiResponse?.meta?.total || 0;
  const hasNext = apiResponse?.meta?.hasNext || false;
  const hasPrevious = apiResponse?.meta?.hasPrevious || false;

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, sortOrder]);

  const handleClaimRequest = async (requestId: number, jobType: string) => {
    try {
      if (jobType === "pickup") {
        await claimPickUpMutation.mutateAsync(requestId);
      } else if (jobType === "delivery") {
        await claimDeliveryMutation.mutateAsync(requestId);
      }
      toast.success(`Successfully claimed ${jobType} request`);
      refetch();
    } catch (error) {
      toast.error(`Failed to claim ${jobType} request. Please try again.`);
      console.error(`Failed to claim ${jobType} request:`, error);
    }
  };

  const handleCloseMapModal = () => {
    setSelectedRequest(null);
  };

  const handleNavigate = (coordinates: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, "_blank");
  };

  const RequestCard = ({ request }: { request: any }) => (
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
          <Badge
            variant={request.jobType === "pickup" ? "outline" : "secondary"}
            className="flex items-center gap-1"
          >
            {request.jobType === "pickup" ? (
              <Package className="h-3 w-3" />
            ) : (
              <Truck className="h-3 w-3" />
            )}
            {request.jobType === "pickup" ? "Pickup" : "Delivery"}
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
            <span>
              {request.jobType === "pickup"
                ? request.order.address_line
                : request.order.address_line || "Address not provided"}
            </span>
          </div>
        </div>

        <div className="text-muted-foreground text-sm">
          <span className="font-medium">Order: </span>
          {request.order.orderNumber}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => handleClaimRequest(request.id, request.jobType)}
            disabled={
              claimPickUpMutation.isPending ||
              claimDeliveryMutation.isPending ||
              claimPickUpMutation.isSuccess ||
              claimDeliveryMutation.isSuccess
            }
            className="flex-1"
          >
            {claimPickUpMutation.isPending ||
            claimDeliveryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : claimPickUpMutation.isSuccess ||
              claimDeliveryMutation.isSuccess ? (
              "Claimed!"
            ) : (
              "Claim Order"
            )}
          </Button>
          <Button variant="outline" className="flex-1">
            View Detail
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate({ lat: 0, lng: 0 })}
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
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading requests...</span>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="flex items-center text-2xl font-bold">
                <Truck className="mr-2 h-8 w-8" /> Request List
              </h1>
              <p className="text-muted-foreground text-sm">
                Active Orders: {currentOrders}/{orderLimit} • Status:{" "}
                {driverBusy ? "Busy" : "Available"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="mr-2 h-4 w-4" />
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Pickup">Pickup</TabsTrigger>
                <TabsTrigger value="Delivery">Delivery</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  placeholder="Search by order number or customer name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <SortDesc className="h-4 w-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Results Summary */}
        {!isLoading && !isError && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {filteredRequests.length} of {totalElements} requests
            </p>
            {totalPages > 0 && (
              <p className="text-muted-foreground text-sm">
                Page {page} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState errorMessage={error?.message} onRetry={() => refetch()} />
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <RequestCard key={request.orderId} request={request} />
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                No requests available
              </h3>
              <p className="text-muted-foreground">
                {search || activeTab !== "All"
                  ? "Try adjusting your filters to see more results."
                  : "Check back later for new pickup and delivery requests."}
              </p>
            </CardContent>
          </Card>
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

      {/* Map Modal */}
      <MapModal
        selectedRequest={selectedRequest}
        onClose={handleCloseMapModal}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
