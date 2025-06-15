"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";

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
    if (!dateString) return "Belum dijadwalkan";
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
        <h2 className="text-xl font-semibold">Pelanggan & Alamat</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="rounded-md border p-2">
            <h3 className="mb-2 font-medium">Informasi Pelanggan</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{customer.name}</span>
                <Badge
                  variant={customer.verified ? "default" : "outline"}
                  className="ml-auto text-xs"
                >
                  {customer.verified ? "Terverifikasi" : "Belum Terverifikasi"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span >{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border p-2">
            <h3 className="mb-2 font-medium">Alamat Penjemputan</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="text-sm">{pickupAddress.address}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terjadwal :</span>
                  <span>{formatDate(pickupAddress.scheduledTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aktual :</span>
                  <span>{formatDate(pickupAddress.actualTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver :</span>
                  <span>{pickupAddress.driver?.name || "Belum ditugaskan"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border p-2">
            <h3 className="mb-2 font-medium">Alamat Pengiriman</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="text-sm">{deliveryAddress.address}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terjadwal :</span>
                  <span>{formatDate(deliveryAddress.scheduledTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aktual :</span>
                  <span>{formatDate(deliveryAddress.actualTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver :</span>
                  <span>{deliveryAddress.driver?.name || "Belum ditugaskan"}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}