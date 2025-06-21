"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { VerificationItem } from "@/hooks/api/employee/worker/useProcessOrder";

interface ItemVerificationCardProps {
  orderData: any;
  verificationItems: VerificationItem[];
  updateVerificationItem: (
    index: number,
    field: keyof VerificationItem,
    value: string,
  ) => void;
  addVerificationItem: () => void;
  handleStartProcess: () => void;
  isDisabled: boolean;
  isPending: boolean;
  isCompleted: boolean;
  bypassStatus?: "PENDING" | "REJECTED" | "APPROVED";
}

export default function ItemVerificationCard({
  orderData,
  verificationItems,
  updateVerificationItem,
  addVerificationItem,
  handleStartProcess,
  isDisabled,
  isPending,
  isCompleted,
  bypassStatus,
}: ItemVerificationCardProps) {
  const renderStatusIcon = () => {
    return isCompleted ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-amber-500" />
    );
  };

  const renderStatusBadges = () => {
    const badges = [];

    if (isCompleted) {
      badges.push(
        <Badge key="completed" variant="default" className="ml-2">
          Completed
        </Badge>,
      );
    }

    if (bypassStatus === "PENDING") {
      badges.push(
        <Badge
          key="pending"
          variant="outline"
          className="ml-2 border-orange-300 bg-orange-100 text-orange-700"
        >
          Bypass Pending
        </Badge>,
      );
    }

    if (bypassStatus === "REJECTED") {
      badges.push(
        <Badge
          key="rejected"
          variant="outline"
          className="ml-2 border-red-300 bg-red-100 text-red-700"
        >
          Bypass Rejected
        </Badge>,
      );
    }

    return badges;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {renderStatusIcon()}
          Item Verification
          {renderStatusBadges()}
        </CardTitle>

        <CardDescription>
          {isCompleted
            ? "Items have been verified."
            : "Please verify all items before proceeding."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Verification Items */}
        {verificationItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2"
          >
            {/* Item Type Selection */}
            <div className="space-y-2.5">
              <Label>Item Type</Label>
              <Select
                value={item.type}
                onValueChange={(value) =>
                  updateVerificationItem(index, "type", value)
                }
                disabled={isCompleted}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {orderData.orderItems.map((orderItem: any) => (
                    <SelectItem
                      key={orderItem.id}
                      value={orderItem.laundryItem.name}
                    >
                      {orderItem.laundryItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateVerificationItem(index, "quantity", e.target.value)
                }
                placeholder="0"
                disabled={isCompleted}
              />
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={addVerificationItem}
            className="flex-1"
            disabled={isDisabled}
          >
            Add Item
          </Button>

          <Button
            onClick={handleStartProcess}
            className="flex-1"
            disabled={isDisabled || isPending}
          >
            {isPending ? "Processing..." : "Verify Items"}
          </Button>
        </div>

        {/* Success Alert */}
        {isCompleted && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Items have been successfully verified.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
