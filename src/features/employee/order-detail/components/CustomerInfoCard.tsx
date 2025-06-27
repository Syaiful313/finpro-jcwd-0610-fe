import { Clock, Copy, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Job, type DriverJobResponse } from "@/types/detailApi";
import { formatDate } from "@/utils/formatDate";

interface CustomerInfoCardProps {
  customerName: string;
  customerPhone: string;
  addressInfo: {
    addressLine: string;
    district: string;
    city: string;
    province: string;
    postalCode: string;
  };
  job: Job;
  jobData: DriverJobResponse;
  copyAddress: () => void;
  callCustomer: () => void;
}

export default function CustomerInfoCard({
  customerName,
  customerPhone,
  addressInfo,
  job,
  jobData,
  copyAddress,
  callCustomer,
}: CustomerInfoCardProps) {
  const getScheduledTime = () => {
    if (jobData.type === "pickup") {
      return job?.pickUpScheduleOutlet;
    } else {
      return job?.order?.scheduledDeliveryTime;
    }
  };

  return (
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
        <div className="// Default: tumpuk ke bawah (mobile), md ke atas: jejer ke samping (desktop) // Default: rata kiri, md ke atas: di tengah (vertikal) // Jarak antar item (kecil di mobile, lebih besar di desktop) flex flex-col items-start gap-2 text-sm md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatDate(getScheduledTime())}</span>
            </div>
            <Badge variant="outline">{jobData.type.toUpperCase()}</Badge>
          </div>

          {jobData.type === "pickup" && (
            <p className="text-gray-600">
              It is recommended to start heading for pickup 30 minutes early.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
