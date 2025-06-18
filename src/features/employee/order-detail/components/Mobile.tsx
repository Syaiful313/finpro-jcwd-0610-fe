"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Copy,
  Navigation,
  Camera,
  MapPin,
  Clock,
  Package,
  User,
  Map,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import formatRupiah from "@/utils/RupiahFormat";

type OrderStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
type OrderType = "PICKUP" | "DELIVERY";
type JobStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";

interface OrderItem {
  id: string;
  laundryItemName: string;
  quantity: number;
  weight?: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface CustomerAddress {
  addressLine: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  scheduledTime: string;
  address: CustomerAddress;
  items: OrderItem[];
  totalWeight: number;
  totalPrice: number;
  pickupJobStatus?: JobStatus;
  deliveryJobStatus?: JobStatus;
  driverNotes?: string;
  pickupPhotos?: string[];
}

const mockOrder: Order = {
  id: "1",
  orderNumber: "ORD-2024-001",
  status: "ASSIGNED",
  customerName: "Sarah Johnson",
  customerPhone: "+62 812-3456-7890",
  orderType: "PICKUP",
  scheduledTime: "2024-01-15T14:00:00Z",
  address: {
    addressLine: "Jl. Sudirman No. 123, Block A",
    district: "Kebayoran Baru",
    city: "South Jakarta",
    province: "DKI Jakarta",
    postalCode: "12190",
    latitude: -6.2088,
    longitude: 106.8456,
  },
  items: [
    {
      id: "1",
      laundryItemName: "White Shirt",
      quantity: 3,
      weight: 0.5,
      pricePerUnit: 8000,
      totalPrice: 24000,
    },
    {
      id: "2",
      laundryItemName: "Jeans",
      quantity: 2,
      weight: 0.8,
      pricePerUnit: 12000,
      totalPrice: 24000,
    },
    {
      id: "3",
      laundryItemName: "Dress",
      quantity: 1,
      weight: 0.3,
      pricePerUnit: 15000,
      totalPrice: 15000,
    },
  ],
  totalWeight: 1.6,
  totalPrice: 63000,
  pickupJobStatus: "ASSIGNED",
  driverNotes: "",
};

export default function DriverOrderDetail() {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isStartJobDialogOpen, setIsStartJobDialogOpen] = useState(false);
  const [notes, setNotes] = useState(order.driverNotes || "");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: OrderStatus | JobStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-500";
      case "ASSIGNED":
        return "bg-blue-500";
      case "IN_PROGRESS":
        return "bg-green-500";
      case "COMPLETED":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: OrderStatus | JobStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyAddress = () => {
    const fullAddress = `${order.address.addressLine}, ${order.address.district}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}`;
    navigator.clipboard.writeText(fullAddress);
    alert("Address copied to clipboard!");
  };

  const callCustomer = () => {
    window.open(`tel:${order.customerPhone}`);
  };

  const startNavigation = () => {
    const { latitude, longitude } = order.address;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const startJob = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder((prev) => ({
        ...prev,
        status: "IN_PROGRESS",
        pickupJobStatus: "IN_PROGRESS",
      }));

      setIsStartJobDialogOpen(false);
      alert("Job started successfully! You can now proceed with the pickup.");
    } catch (error) {
      console.error("Error starting job:", error);
      alert("Failed to start job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async () => {
    if (selectedPhotos.length === 0) {
      alert("Please upload at least one photo to complete the task.");
      return;
    }

    setIsLoading(true);
    try {
      const taskType = order.orderType === "PICKUP" ? "pickup" : "delivery";

      const formData = new FormData();
      selectedPhotos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });
      formData.append("notes", notes);
      formData.append("orderId", order.id);
      formData.append("taskType", taskType);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setOrder((prev) => ({
        ...prev,
        status: "COMPLETED",
        pickupJobStatus: "COMPLETED",
        driverNotes: notes,
      }));

      setIsCompleteDialogOpen(false);
      alert(
        `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} completed successfully!`,
      );

      setSelectedPhotos([]);
      setNotes("");
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to complete task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentJobStatus = () => {
    return order.orderType === "PICKUP"
      ? order.pickupJobStatus
      : order.deliveryJobStatus;
  };

  const renderActionButtons = () => {
    const currentStatus = getCurrentJobStatus();
    const taskType = order.orderType === "PICKUP" ? "Pickup" : "Delivery";

    if (currentStatus === "COMPLETED") {
      return (
        <div className="fixed right-0 bottom-0 left-0 p-4">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              {taskType} Completed Successfully!
            </span>
          </div>
        </div>
      );
    }

    switch (currentStatus) {
      case "ASSIGNED":
        return (
          <div className="fixed right-0 bottom-0 left-0 space-y-2 border-t bg-white p-4">
            <Button
              onClick={startNavigation}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Start Navigation
            </Button>
            <Dialog
              open={isStartJobDialogOpen}
              onOpenChange={setIsStartJobDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
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
                      Make sure you have arrived at the customer location.
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
      case "IN_PROGRESS":
        return (
          <div className="fixed right-0 bottom-0 left-0 border-t bg-white p-4">
            <Dialog
              open={isCompleteDialogOpen}
              onOpenChange={setIsCompleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Camera className="mr-2 h-4 w-4" />
                  Complete {taskType}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Complete {taskType}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <Camera className="h-4 w-4" />
                    <AlertDescription>
                      Please upload photos and add notes to complete the{" "}
                      {taskType.toLowerCase()}.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="photos">Upload Photos *</Label>
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload photos as proof of {taskType.toLowerCase()}{" "}
                      completion (Required)
                    </p>
                  </div>

                  {selectedPhotos.length > 0 && (
                    <div>
                      <Label>Selected Photos ({selectedPhotos.length})</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedPhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={
                                URL.createObjectURL(photo) || "/placeholder.svg"
                              }
                              alt={`Photo ${index + 1}`}
                              width={100}
                              height={100}
                              className="h-20 w-full rounded border object-cover"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removePhoto(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder={`Add notes about the ${taskType.toLowerCase()}...`}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                      onClick={() => setIsCompleteDialogOpen(false)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={completeTask}
                      className="flex-1"
                      disabled={selectedPhotos.length === 0 || isLoading}
                    >
                      {isLoading ? "Completing..." : `Complete ${taskType}`}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{order.orderNumber}</h1>
            <Badge className={`${getStatusColor(order.status)} text-white`}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Status Progress Indicator */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${getCurrentJobStatus() === "ASSIGNED" ? "bg-blue-500" : "bg-green-500"}`}
            />
            <span className="text-sm font-medium">Assigned</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${getCurrentJobStatus() === "IN_PROGRESS" || getCurrentJobStatus() === "COMPLETED" ? "w-full bg-green-500" : "w-0 bg-gray-200"}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${getCurrentJobStatus() === "IN_PROGRESS" ? "bg-green-500" : getCurrentJobStatus() === "COMPLETED" ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-sm font-medium">In Progress</span>
          </div>
          <div className="mx-4 h-0.5 flex-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-500 ${getCurrentJobStatus() === "COMPLETED" ? "w-full bg-green-500" : "w-0 bg-gray-200"}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${getCurrentJobStatus() === "COMPLETED" ? "bg-green-500" : "bg-gray-300"}`}
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
              {order.customerName}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={callCustomer}>
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Address</p>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="font-medium">{order.address.addressLine}</p>
            <p className="text-sm text-gray-600">
              {order.address.district}, {order.address.city},{" "}
              {order.address.province} {order.address.postalCode}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatDateTime(order.scheduledTime)}</span>
            </div>
            <Badge variant="outline">{order.orderType}</Badge>
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
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-500" />
              <p className="text-sm text-gray-600">Interactive Map</p>
              <p className="text-xs text-gray-500">
                Lat: {order.address.latitude}, Lng: {order.address.longitude}
              </p>
            </div>
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

      {/* Order Details */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="items">
            <AccordionItem value="items">
              <AccordionTrigger>
                Laundry Items ({order.items.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.laundryItemName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} pcs{" "}
                          {item.weight && `• ${item.weight} kg`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatRupiah(item.pricePerUnit)} per pcs
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatRupiah(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Weight</span>
              <span className="font-medium">{order.totalWeight} kg</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Price</span>
              <span>{formatRupiah(order.totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Status Card */}
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(getCurrentJobStatus()!)} text-white`}
            >
              {getStatusText(getCurrentJobStatus()!)}
            </Badge>
            <span className="text-sm text-gray-600">
              {order.orderType} Task
            </span>
          </div>
          {order.driverNotes && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Driver Notes:</p>
              <p className="text-sm">{order.driverNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {renderActionButtons()}
    </div>
  );
}
