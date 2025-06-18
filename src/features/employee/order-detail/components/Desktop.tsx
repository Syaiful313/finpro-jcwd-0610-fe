import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  CreditCard,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Navigation,
  Package,
  Phone,
  Play,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import { format } from "path";
import formatRupiah from "@/utils/RupiahFormat";

interface DesktopLayoutProps {
  jobData: any;
}
const jobData = {
  orderNumber: "#slibaww00900",
  jobType: "DELIVERY" as "PICKUP" | "DELIVERY",
  driverStatus: "ASSIGNED" as
    | "PENDING"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED",
  customer: {
    name: "Albus Dumbledore",
    phone: "08123456788",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 4.8,
  },
  pickup: {
    address: "775 Rolling Green Rd.",
    time: "2:00 PM",
  },
  dropoff: {
    address: "2464 Royal Ln. Mesa",
    time: "4:30 PM",
  },
  load: {
    weight: "2.5 Kg",
    items: "12 clothing items",
  },
  payment: {
    status: "PAID" as "PAID" | "WAITING_PAYMENT",
    total: 75000,
    method: "Digital Wallet",
  },
};

const DesktopLayout: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Order Detail" },
    ]);
  }, [setBreadcrumbs]);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigate = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${jobData.dropoff.address}`,
      "_blank",
    );
  };

  const handleCall = () => {
    window.open(`tel:${jobData.customer.phone}`, "_self");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${jobData.customer.name}, I'm your driver for order ${jobData.orderNumber}`,
    );
    window.open(
      `https://wa.me/${jobData.customer.phone.replace(/^0/, "62")}?text=${message}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Job Details - {jobData.orderNumber}
          </h1>
        </div>
        <Button variant="ghost" size="sm" className="p-2">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">
                Customer Information
              </h2>
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={jobData.customer.avatar}
                    alt={jobData.customer.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-600">
                    {jobData.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {jobData.customer.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{jobData.customer.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{jobData.customer.phone}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCall}
                    size="sm"
                    variant="outline"
                    className="px-4"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    size="sm"
                    variant="outline"
                    className="px-4"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Location Details</h2>
              <div className="space-y-4">
                {/* Pickup Point */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Pickup Point
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {jobData.pickup.address}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {jobData.pickup.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                {/* Drop Off Point */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Drop Off Point
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {jobData.dropoff.address}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {jobData.dropoff.time}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4"
                      onClick={handleNavigate}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Details */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Load Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  <Package className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Weight
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {jobData.load.weight}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                  <Package className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Items
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {jobData.load.items}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Delivery Photo</h2>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-700">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Delivery photo"
                      className="mx-auto h-48 w-full max-w-md rounded-xl object-cover"
                    />
                    <p className="font-medium text-green-600">
                      Photo uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-600">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Take a photo of the delivery
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload-desktop"
                />
                <label
                  htmlFor="photo-upload-desktop"
                  className="mt-4 inline-block cursor-pointer rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  {imagePreview ? "Change Photo" : "Take Photo"}
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Status */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Job Status</h2>
              <div className="space-y-3">
                <Badge
                  variant={
                    jobData.driverStatus === "ASSIGNED"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    jobData.driverStatus === "ASSIGNED"
                      ? "rounded-full bg-blue-600 px-6 py-2 text-sm text-white"
                      : "rounded-full bg-gray-100 px-6 py-2 text-sm text-gray-600"
                  }
                >
                  {jobData.driverStatus}
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-gray-100 px-6 py-2 text-sm text-gray-600"
                >
                  {jobData.jobType}
                </Badge>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">
                Payment Information
              </h2>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {jobData.payment.method}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-green-100 px-4 py-1 text-xs text-green-700"
                  >
                    {jobData.payment.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatRupiah(jobData.payment.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="sticky top-6 rounded-lg border-0 bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Actions</h2>
              {jobData.driverStatus === "ASSIGNED" && (
                <Button className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700">
                  <Play className="mr-2 h-5 w-5" />
                  Start Job
                </Button>
              )}
              {jobData.driverStatus === "IN_PROGRESS" && (
                <Button className="w-full rounded-xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DesktopLayout;
