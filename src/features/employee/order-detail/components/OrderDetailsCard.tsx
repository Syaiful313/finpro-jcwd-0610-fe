import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Job } from "@/types/detailApi";
import formatRupiah from "@/utils/RupiahFormat";

interface OrderDetailsCardProps {
  job: Job;
}

export default function OrderDetailsCard({ job }: OrderDetailsCardProps) {
  return (
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
            <span className="text-secondary-foreground">Total Weight</span>
            <span className="font-medium">{job.order.totalWeight} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-foreground">Delivery Fee</span>
            <span className="font-medium">
              {formatRupiah(job.order.totalDeliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Price</span>
            <span>{formatRupiah(job.order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-foreground">Payment Status</span>
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
  );
}
