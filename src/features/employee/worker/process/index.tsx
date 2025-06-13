"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Camera,
  Package,
  CreditCard,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function ProcessOrder() {
  const [step, setStep] = useState(1); // 1: verify, 2: process, 3: complete
  const [verificationItems, setVerificationItems] = useState([
    { type: "", quantity: "", condition: "" },
  ]);
  const [mismatches, setMismatches] = useState<any[]>([]);
  const [bypassRequest, setBypassRequest] = useState({
    reason: "",
    photo: null,
  });
  const [showBypassModal, setShowBypassModal] = useState(false);

  // Mock order data
  const originalOrder = {
    id: "ORD-101",
    customer: "Alice Brown",
    items: [
      { type: "Shirt", quantity: 3, condition: "Good" },
      { type: "Pants", quantity: 2, condition: "Stained" },
      { type: "Dress", quantity: 1, condition: "Good" },
    ],
    paymentStatus: "paid", // paid, unpaid
    station: "packing",
  };

  const addVerificationItem = () => {
    setVerificationItems([
      ...verificationItems,
      { type: "", quantity: "", condition: "" },
    ]);
  };

  const updateVerificationItem = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...verificationItems];
    updated[index] = { ...updated[index], [field]: value };
    setVerificationItems(updated);
  };

  const checkForMismatches = () => {
    const foundMismatches: any[] = [];

    // Compare verification items with original order
    verificationItems.forEach((verItem, index) => {
      const originalItem = originalOrder.items[index];
      if (originalItem) {
        if (
          verItem.type !== originalItem.type ||
          Number.parseInt(verItem.quantity) !== originalItem.quantity ||
          verItem.condition !== originalItem.condition
        ) {
          foundMismatches.push({
            index,
            original: originalItem,
            verified: verItem,
            issues: [],
          });
        }
      }
    });

    setMismatches(foundMismatches);

    if (foundMismatches.length > 0) {
      setShowBypassModal(true);
    } else {
      setStep(2);
    }
  };

  const submitBypassRequest = () => {
    // In real app, this would send to admin for approval
    setShowBypassModal(false);
    setStep(2);
  };

  const completeOrder = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm md:relative">
        <div className="flex items-center gap-3 p-4">
          <Link href="/worker/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">
              Process Order #{originalOrder.id}
            </h1>
            <p className="text-sm text-gray-600">{originalOrder.customer}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full space-y-6 p-4">
        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <span className="text-sm font-medium">Verify</span>
          </div>
          <div
            className={`mx-4 h-1 flex-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
          ></div>
          <div
            className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="text-sm font-medium">Process</span>
          </div>
          <div
            className={`mx-4 h-1 flex-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
          ></div>
          <div
            className={`flex items-center gap-2 ${step >= 3 ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
            >
              3
            </div>
            <span className="text-sm font-medium">Complete</span>
          </div>
        </div>

        {/* Step 1: Item Verification */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Original Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Original Order Items</CardTitle>
                <CardDescription>
                  Items as listed in the original order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {originalOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <div className="font-medium">{item.type}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity} • {item.condition}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Item Re-input Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Re-input Item Verification
                </CardTitle>
                <CardDescription>
                  Please re-enter all items to verify accuracy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-3"
                  >
                    <div className="flex-1 flex-col space-y-2.5">
                      <Label>Item Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value) =>
                          updateVerificationItem(index, "type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shirt">Shirt</SelectItem>
                          <SelectItem value="Pants">Pants</SelectItem>
                          <SelectItem value="Dress">Dress</SelectItem>
                          <SelectItem value="Jacket">Jacket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2.5">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateVerificationItem(
                            index,
                            "quantity",
                            e.target.value,
                          )
                        }
                        placeholder="0"
                        className="flex-1"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <Label>Condition</Label>
                      <Select
                        value={item.condition}
                        onValueChange={(value) =>
                          updateVerificationItem(index, "condition", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Stained">Stained</SelectItem>
                          <SelectItem value="Damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={addVerificationItem}
                    className="flex-1"
                  >
                    Add Item
                  </Button>
                  <Button onClick={checkForMismatches} className="flex-1">
                    Verify Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Processing at Packing Station
                </CardTitle>
                <CardDescription>Complete the packing process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quality Check</Label>
                    <Select defaultValue="passed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Packaging Type</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="eco">Eco-Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payment Status Check for Packing Station */}
                <Alert
                  className={
                    originalOrder.paymentStatus === "paid"
                      ? "border-green-500 bg-green-50"
                      : "border-amber-500 bg-amber-50"
                  }
                >
                  <CreditCard className="h-4 w-4" />
                  <AlertDescription>
                    Payment Status:{" "}
                    <Badge
                      variant={
                        originalOrder.paymentStatus === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {originalOrder.paymentStatus === "paid"
                        ? "Paid"
                        : "Waiting for Payment"}
                    </Badge>
                  </AlertDescription>
                </Alert>

                <div>
                  <Label>Processing Notes</Label>
                  <Textarea placeholder="Add any processing notes..." />
                </div>

                <Button onClick={completeOrder} className="w-full">
                  Complete Processing
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Completion */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h2 className="mb-2 text-xl font-semibold">
                  Order Processed Successfully!
                </h2>
                <p className="mb-4 text-gray-600">
                  Order #{originalOrder.id} has been completed
                </p>

                <div className="space-y-3">
                  {originalOrder.paymentStatus === "paid" ? (
                    <Badge className="flex items-center justify-center gap-2 bg-green-500 p-2 text-white">
                      <Truck className="h-4 w-4" />
                      Ready for Delivery
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex items-center justify-center gap-2 p-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Waiting for Payment
                    </Badge>
                  )}
                </div>

                <div className="mt-6 flex gap-2">
                  <Link href="/worker/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Button className="flex-1">Next Order</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bypass Request Modal */}
        {showBypassModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Item Mismatch Detected
                </CardTitle>
                <CardDescription>
                  Discrepancies found between original order and verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason for Discrepancy</Label>
                  <Textarea
                    placeholder="Explain the reason for the mismatch..."
                    value={bypassRequest.reason}
                    onChange={(e) =>
                      setBypassRequest((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo Evidence (Optional)</Label>
                  <Button variant="outline" className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBypassModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={submitBypassRequest} className="flex-1">
                    Request Bypass
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
