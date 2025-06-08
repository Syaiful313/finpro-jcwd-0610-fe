import { useRouter } from "next/navigation";
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
import { useState } from "react";

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

const MobileLayout: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen justify-center px-4 md:px-8 lg:px-16">
      {/* Mobile Container */}
      <div className="relative min-h-screen w-full bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 p-2"
            onClick={router.back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Job Details</h1>
          <Button variant="ghost" size="sm" className="-mr-2 p-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-4 pb-24">
          {/* Customer Info */}
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={jobData.customer.avatar || "/placeholder.svg"}
                alt={jobData.customer.name}
              />
              <AvatarFallback className="bg-blue-100 font-semibold text-blue-600">
                {jobData.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {jobData.customer.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{jobData.customer.rating}</span>
                </div>
                <span>•</span>
                <span>{jobData.customer.phone}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCall}
                size="sm"
                variant="outline"
                className="p-2"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="sm"
                variant="outline"
                className="p-2"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Pickup Point */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-600">
                Pickup - Point
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {jobData.pickup.address}
                  </p>
                  <p className="text-sm text-gray-500">{jobData.pickup.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Navigation className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Drop Off Point
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-600">
                Drop Off - Point
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {jobData.dropoff.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {jobData.dropoff.time}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={handleNavigate}
              >
                <Navigation className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div> */}

          {/* Job Status */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-600">
              Job Status
            </h3>
            <div className="flex gap-2">
              <Badge
                variant={
                  jobData.driverStatus === "ASSIGNED" ? "default" : "secondary"
                }
                className={
                  jobData.driverStatus === "ASSIGNED"
                    ? "rounded-full bg-blue-600 px-4 py-2 text-white"
                    : "rounded-full bg-gray-100 px-4 py-2 text-gray-600"
                }
              >
                {jobData.driverStatus}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-gray-100 px-4 py-2 text-gray-600"
              >
                {jobData.jobType}
              </Badge>
            </div>
          </div>

          {/* Load Details */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-600">
              Load Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Weight</p>
                    <p className="text-sm text-gray-500">
                      {jobData.load.weight}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Items</p>
                    <p className="text-sm text-gray-500">
                      {jobData.load.items}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-600">Payment</h3>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {jobData.payment.method}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                >
                  {jobData.payment.status}
                </Badge>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(jobData.payment.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-600">
              Delivery Photo
            </h3>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Delivery photo"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                  <p className="text-sm font-medium text-green-600">
                    Photo uploaded
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Take delivery photo</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="mt-3 inline-block cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                {imagePreview ? "Change Photo" : "Take Photo"}
              </label>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action */}
        <div className="sticky right-0 bottom-0 left-0 border-t border-gray-100 bg-white p-4">
          {jobData.driverStatus === "ASSIGNED" && (
            <Button className="w-full rounded-2xl">
              <Play className="mr-2 h-5 w-5" />
              Start Job
            </Button>
          )}
          {jobData.driverStatus === "IN_PROGRESS" && (
            <Button className="w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white hover:bg-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Job {formatCurrency(jobData.payment.total)}
            </Button>
          )}
        </div>

        {/* Bottom Navigation Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
          <div className="h-1 w-32 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
