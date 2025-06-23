"use client";

import {
  ArrowLeft,
  Clock,
  Copy,
  Map,
  Navigation,
  Package,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  type DriverJobDetailResponse,
  type ActiveJobs,
} from "@/types/activeJobs";
import { formatDate } from "@/utils/formatDate";
import formatRupiah from "@/utils/RupiahFormat";
import SimpleMap from "../../driver/components/SimpleMap";

interface DriverHistoryDetailProps {
  data: DriverJobDetailResponse;
}

const DriverHistoryDetailPage = ({ data }: DriverHistoryDetailProps) => {
  const router = useRouter();
  const job = data.job;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-500";
      case "IN_PROGRESS":
        return "bg-primary";
      case "COMPLETED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status.replace(/_/g, " ");
    }
  };

  const formatFullAddress = (order: ActiveJobs["order"]) => {
    const addressLine = order.addressLine;
    const district = order.district;
    const city = order.city;
    const province = order.province;
    const postalCode = order.postalCode;

    return {
      addressLine,
      district,
      city,
      province,
      postalCode,
      fullAddress: `${addressLine}, ${district}, ${city}, ${province} ${postalCode}`,
    };
  };

  const addressInfo = formatFullAddress(job.order);
  const coordinates = {
    latitude: job?.order?.latitude || 0,
    longitude: job?.order?.longitude || 0,
  };
  const customerName = `${job.order.user.firstName} ${job.order.user.lastName}`;
  const customerPhone = job.order.user.phoneNumber;

  const copyAddress = () => {
    navigator.clipboard.writeText(addressInfo.fullAddress);
    toast("Address copied to clipboard!");
  };

  const callCustomer = () => {
    window.open(`tel:${customerPhone}`);
  };

  const startNavigation = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="block md:hidden"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-3">
            <h1 className="text-lg font-semibold">{job.order.orderNumber}</h1>
            <Badge className={`${getStatusColor(job.status)} text-white`}>
              {getStatusText(job.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Assigned</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-green-500" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-green-500" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Finished</span>
          </div>
        </div>
      </div>

      <Card className="m-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              {customerName}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={callCustomer}>
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-secondary-foreground text-sm">Phone Number</p>
            <p className="font-medium">{customerPhone}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-secondary-foreground text-sm">Address</p>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-medium">{addressInfo.addressLine}</p>
            <p className="text-secondary-foreground text-sm">
              {addressInfo.district}, {addressInfo.city}, {addressInfo.province}{" "}
              {addressInfo.postalCode}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                {job.order.scheduledPickupTime
                  ? formatDate(job.order.scheduledPickupTime)
                  : formatDate(job.createdAt)}
              </span>
            </div>
            <Badge variant="outline">{data.type.toUpperCase()}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="m-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Customer Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-200">
            <SimpleMap
              coordinates={coordinates}
              address={addressInfo.addressLine}
            />
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={startNavigation}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
        </CardContent>
      </Card>

      {data.type === "delivery" && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Order Number</span>
                <span className="font-medium">{job.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Outlet</span>
                <span className="font-medium">
                  {job.order.outlet.outletName}
                </span>
              </div>
              {job.order.totalPickupFee && (
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Pickup Fee</span>
                  <span className="font-medium">
                    {formatRupiah(job.order.totalPickupFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Delivery Fee</span>
                <span className="font-medium">
                  {formatRupiah(job.order.totalDeliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Fee</span>
                <span>
                  {formatRupiah(
                    job.order.totalDeliveryFee +
                      (job.order.totalPickupFee || 0),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">
                  Payment Status
                </span>
                <Badge
                  variant={
                    job.order.paymentStatus === "PAID" ? "default" : "secondary"
                  }
                >
                  {job.order.paymentStatus.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="m-4">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(job.status)} text-white`}>
              {getStatusText(job.status)}
            </Badge>
            <span className="text-secondary-foreground text-sm">
              {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Task
            </span>
          </div>
          {job.notes && (
            <div className="bg-input/50 mt-3 rounded-lg p-3">
              <p className="text-sm font-medium">Driver Notes:</p>
              <p className="mt-1 text-sm">{job.notes}</p>
            </div>
          )}

          {job.status === "COMPLETED" && (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-700/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Task Completed
              </p>
              <p className="mt-1 text-sm text-green-600">
                This {data.type} task has been completed successfully.
              </p>
              {(job.order.actualPickupTime || job.order.actualDeliveryTime) && (
                <p className="mt-1 text-sm text-green-600">
                  Completed at:{" "}
                  {formatDate(
                    job.order.actualPickupTime ||
                      job.order.actualDeliveryTime ||
                      job.updatedAt,
                  )}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {job.pickUpPhotos && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>Pickup Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Image
                src={job.pickUpPhotos || "/placeholder.svg"}
                alt="Pickup photo"
                width={200}
                height={150}
                className="h-60 w-full rounded border object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {job.deliveryPhotos && (
        <Card className="m-4">
          <CardHeader>
            <CardTitle>Delivery Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Image
                src={job.deliveryPhotos || "/placeholder.svg"}
                alt="Delivery photo"
                width={200}
                height={150}
                className="h-60 w-full rounded border object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverHistoryDetailPage;
