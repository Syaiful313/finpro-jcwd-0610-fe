"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VerificationItem } from "@/hooks/api/employee/worker/useProcessOrder";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  isCompleted?: boolean;
  currentStep: string;
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
  currentStep,
}: ItemVerificationCardProps) {
  const isFormDisabled = isCompleted && bypassStatus !== "REJECTED";
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
          className="ml-2 border-red-300 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-500"
        >
          Bypass Rejected
        </Badge>,
      );
    }

    return badges;
  };

  const getDescription = () => {
    if (bypassStatus === "REJECTED") {
      return "Bypass request was rejected. Please re-verify the items.";
    }
    if (isCompleted) {
      return "Items have been verified.";
    }
    return "Please verify all items before proceeding.";
  };

  const getButtonText = () => {
    if (isPending) return "Processing...";
    if (currentStep === "bypass_rejected") return "Re-verify Items";
    return "Verify Items";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {renderStatusIcon()}
          Item Verification
          {renderStatusBadges()}
        </CardTitle>

        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {verificationItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2"
          >
            <div className="space-y-2.5">
              <Label>Item Type</Label>
              <Select
                value={item.type}
                onValueChange={(value) =>
                  updateVerificationItem(index, "type", value)
                }
                disabled={isFormDisabled}
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

            <div className="space-y-2.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateVerificationItem(index, "quantity", e.target.value)
                }
                placeholder="0"
                disabled={isFormDisabled}
              />
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={addVerificationItem}
            className="flex-1"
            disabled={isDisabled || isFormDisabled}
          >
            Add Item
          </Button>

          <Button
            onClick={handleStartProcess}
            className="flex-1"
            disabled={isDisabled || isPending}
          >
            {getButtonText()}
          </Button>
        </div>

        {isCompleted && (
          <Alert className="border-green-600 bg-green-50 dark:border-green-800 dark:bg-green-900/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-500">
              Items have been successfully verified.
            </AlertDescription>
          </Alert>
        )}

        {bypassStatus === "REJECTED" && !isCompleted && (
          <Alert className="border-red-600 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-500">
              Bypass request was rejected. Please verify the items again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
