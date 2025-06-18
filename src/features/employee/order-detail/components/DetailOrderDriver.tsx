"use client";

import { useFormik } from "formik";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Clock,
  Copy,
  Map,
  MapPin,
  Navigation,
  Package,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import useCompleteDelivery from "@/hooks/api/employee/driver/useCompleteDelivery";
import useCompletePickUp from "@/hooks/api/employee/driver/useCompletePickUp";
import useStartDelivery from "@/hooks/api/employee/driver/useStartDelivery";
import useStartPickUp from "@/hooks/api/employee/driver/useStartPickUp";
import {
  DriverJobResponse,
  Job,
  OrderStatus,
  formatFullAddress,
  getCustomerName,
} from "@/types/detailApi";
import { DriverTaskStatus } from "@/types/enum";
import { formatDate } from "@/utils/formatDate";
import formatRupiah from "@/utils/RupiahFormat";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import SimpleMap from "../../driver/components/SimpleMap";

interface DriverOrderDetailPageProps {
  jobData: DriverJobResponse;
}

interface CompleteJobFormValues {
  notes: string;
  photo: File | null;
}

export default function JobDetails({ jobData }: DriverOrderDetailPageProps) {
  const [job, setJob] = useState<Job>(jobData.job);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isStartJobDialogOpen, setIsStartJobDialogOpen] = useState(false);
  const router = useRouter();
  const startPickUpMutation = useStartPickUp();
  const startDeliveryMutation = useStartDelivery();
  const completePickUpMutation = useCompletePickUp(job.id);
  const completeDeliveryMutation = useCompleteDelivery(job.id);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Details" },
    ]);
  }, [setBreadcrumbs]);

  const startJobMutation =
    jobData.type === "pickup" ? startPickUpMutation : startDeliveryMutation;

  const completeJobMutation =
    jobData.type === "pickup"
      ? completePickUpMutation
      : completeDeliveryMutation;

  const initialValues: CompleteJobFormValues = {
    notes: job.notes || "",
    photo: null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.photo) {
        toast.error("Please upload a photo to complete the task.");
        return;
      }

      try {
        if (jobData.type === "pickup") {
          await completePickUpMutation.mutateAsync({
            notes: values.notes,
            pickUpPhotos: values.photo,
          });
        } else {
          await completeDeliveryMutation.mutateAsync({
            notes: values.notes,
            deliveryPhotos: values.photo,
          });
        }

        setJob((prev) => ({
          ...prev,
          status: DriverTaskStatus.COMPLETED,
          notes: values.notes,
        }));

        setIsCompleteDialogOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error completing task:", error);
      }
    },
  });

  console.log("Job Data:", jobData);

  const getStatusColor = (status: DriverTaskStatus | OrderStatus) => {
    switch (status) {
      case DriverTaskStatus.PENDING:
      case OrderStatus.WAITING_FOR_PICKUP:
        return "bg-orange-500";
      case DriverTaskStatus.ASSIGNED:
      case OrderStatus.DRIVER_ON_THE_WAY_TO_CUSTOMER:
        return "bg-blue-500";
      case DriverTaskStatus.IN_PROGRESS:
      case OrderStatus.ARRIVED_AT_CUSTOMER:
      case OrderStatus.BEING_DELIVERED_TO_CUSTOMER:
        return "bg-green-500";
      case DriverTaskStatus.COMPLETED:
      case OrderStatus.COMPLETED:
      case OrderStatus.DELIVERED_TO_CUSTOMER:
        return "bg-gray-500";
      case DriverTaskStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: DriverTaskStatus | OrderStatus) => {
    switch (status) {
      case DriverTaskStatus.PENDING:
        return "Pending";
      case DriverTaskStatus.ASSIGNED:
        return "Assigned";
      case DriverTaskStatus.IN_PROGRESS:
        return "In Progress";
      case DriverTaskStatus.COMPLETED:
        return "Completed";
      case DriverTaskStatus.CANCELLED:
        return "Cancelled";
      case OrderStatus.WAITING_FOR_PICKUP:
        return "Waiting for Pickup";
      case OrderStatus.DRIVER_ON_THE_WAY_TO_CUSTOMER:
        return "Driver on the Way";
      case OrderStatus.ARRIVED_AT_CUSTOMER:
        return "Arrived at Customer";
      case OrderStatus.BEING_DELIVERED_TO_CUSTOMER:
        return "Being Delivered";
      case OrderStatus.DELIVERED_TO_CUSTOMER:
        return "Delivered";
      case OrderStatus.COMPLETED:
        return "Completed";
      default:
        return status.replace(/_/g, " ");
    }
  };

  const addressInfo = formatFullAddress(job.order);
  const coordinates = {
    latitude: job.order.latitude,
    longitude: job.order.longitude,
  };
  const customerName = getCustomerName(jobData.job);
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    formik.setFieldValue("photo", file);
  };

  const startJob = async () => {
    try {
      await startJobMutation.mutateAsync(job.id);

      setJob((prev) => ({
        ...prev,
        status: DriverTaskStatus.IN_PROGRESS,
      }));
      setIsStartJobDialogOpen(false);
    } catch (error) {
      console.error("Error starting job:", error);
    }
  };

  const renderActionButtons = () => {
    const taskType = jobData.type === "pickup" ? "Pickup" : "Delivery";
    const isLoading =
      startJobMutation.isPending || completeJobMutation.isPending;

    if (job.status === DriverTaskStatus.COMPLETED) {
      return (
        <div className="fixed right-0 bottom-0 left-0 bg-white p-4 md:static">
          <div className="flex items-center justify-center gap-2 text-green-600 md:p-5">
            <CheckCircle className="h-5 w-5" />
            <span className="font-lg md:font-xl">
              {taskType} Completed Successfully!
            </span>
          </div>
        </div>
      );
    }

    switch (job.status) {
      case DriverTaskStatus.ASSIGNED:
        return (
          <div className="fixed right-0 bottom-0 left-0 space-y-2 border-t bg-white p-4">
            <Dialog
              open={isStartJobDialogOpen}
              onOpenChange={setIsStartJobDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full" size="lg" disabled={isLoading}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Start {taskType}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Start {taskType} Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      Are you ready to start the {taskType.toLowerCase()} job?
                      Prepare your vehicle for the {taskType.toLowerCase()}.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsStartJobDialogOpen(false)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={startJob}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Starting..." : `Start ${taskType}`}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case DriverTaskStatus.IN_PROGRESS:
        return (
          <div className="fixed right-0 bottom-0 left-0 border-t bg-white p-4">
            <Dialog
              open={isCompleteDialogOpen}
              onOpenChange={setIsCompleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full" size="lg" disabled={isLoading}>
                  <Camera className="mr-2 h-4 w-4" />
                  Complete {taskType}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Complete {taskType}</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <Alert>
                    <Camera className="h-4 w-4" />
                    <AlertDescription>
                      Please upload photos and add notes to complete the{" "}
                      {taskType.toLowerCase()}.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="photo">Upload Photo *</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a photo as proof of {taskType.toLowerCase()}{" "}
                      completion (Required)
                    </p>
                  </div>

                  {formik.values.photo && (
                    <div>
                      <Label>Selected Photo</Label>
                      <div className="mt-2">
                        <div className="relative inline-block">
                          <Image
                            src={URL.createObjectURL(formik.values.photo)}
                            alt="Selected photo"
                            width={200}
                            height={150}
                            className="h-32 w-48 rounded border object-cover"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => formik.setFieldValue("photo", null)}
                            type="button"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder={`Add notes about the ${taskType.toLowerCase()}...`}
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1"
                      rows={3}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional: Add any relevant notes or observations
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCompleteDialogOpen(false);
                        formik.resetForm();
                      }}
                      className="flex-1"
                      disabled={isLoading}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!formik.values.photo || isLoading}
                    >
                      {isLoading ? "Completing..." : `Complete ${taskType}`}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b bg-white p-4">
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
            <h1 className="text-lg font-semibold">#{job.order.orderNumber}</h1>
            <Badge className={`${getStatusColor(job.status)} text-white`}>
              {getStatusText(job.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Status Progress Indicator */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${job.status === DriverTaskStatus.ASSIGNED ? "bg-blue-500" : "bg-green-500"}`}
            />
            <span className="text-sm font-medium">Assigned</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${job.status === DriverTaskStatus.IN_PROGRESS || job.status === DriverTaskStatus.COMPLETED ? "w-full bg-green-500" : "w-0 bg-gray-200"}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${job.status === DriverTaskStatus.IN_PROGRESS ? "bg-green-500" : job.status === DriverTaskStatus.COMPLETED ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-sm font-medium">In Progress</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${job.status === DriverTaskStatus.COMPLETED ? "w-full bg-green-500" : "w-0 bg-gray-200"}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${job.status === DriverTaskStatus.COMPLETED ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-sm font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
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
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-medium">{customerPhone}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Address</p>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-medium">{addressInfo.addressLine}</p>
            <p className="text-sm text-gray-600">
              {addressInfo.district}, {addressInfo.city}, {addressInfo.province}{" "}
              {addressInfo.postalCode}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatDate(job.pickUpScheduleOutlet)}</span>
            </div>
            <Badge variant="outline">{jobData.type.toUpperCase()}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Map Section */}
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

      {/* Order Details - Only show for delivery jobs */}
      {jobData.type === "delivery" && (
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
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">#{job.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Weight</span>
                <span className="font-medium">{job.order.totalWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {formatRupiah(job.order.totalDeliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Price</span>
                <span>{formatRupiah(job.order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
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

      {/* Job Status Card */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(job.status)} text-white`}>
              {getStatusText(job.status)}
            </Badge>
            <span className="text-sm text-gray-600">
              {jobData.type.charAt(0).toUpperCase() + jobData.type.slice(1)}{" "}
              Task
            </span>
          </div>
          {job.notes && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Driver Notes:</p>
              <p className="text-sm">{job.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {renderActionButtons()}
    </div>
  );
}
