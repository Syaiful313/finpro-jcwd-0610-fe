
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  verified: boolean;
}

export interface AddressInfo {
  address: string;
  scheduledTime: string | null;
  actualTime: string | null;
  driver?: {
    name: string;
  };
}

export function CustomerAddressSection({
  customer,
  pickupAddress,
  deliveryAddress,
}: {
  customer: Customer;
  pickupAddress: AddressInfo;
  deliveryAddress: AddressInfo;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customer & Address</h2>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <>
          {/* Customer Info */}
          <div className="rounded-md border p-3">
            <h3 className="mb-2 font-medium">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{customer.name}</span>
                <Badge variant={customer.verified ? "default" : "outline"} className="ml-auto text-xs text-green-600">
                  {customer.verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="ml-6">{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pickup Address */}
          <div className="rounded-md border p-3">
            <h3 className="mb-2 font-medium">Pickup Address</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{pickupAddress.address}</span>
              </div>
              <div className="space-y-1 pl-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span>{formatDate(pickupAddress.scheduledTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual:</span>
                  <span>{formatDate(pickupAddress.actualTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span>{pickupAddress.driver?.name || "Not assigned"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-md border p-3">
            <h3 className="mb-2 font-medium">Delivery Address</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{deliveryAddress.address}</span>
              </div>
              <div className="space-y-1 pl-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span>{formatDate(deliveryAddress.scheduledTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual:</span>
                  <span>{formatDate(deliveryAddress.actualTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span>{deliveryAddress.driver?.name || "Not assigned"}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}