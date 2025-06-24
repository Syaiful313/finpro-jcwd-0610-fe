"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useGetBypassRequestDetail from "@/hooks/api/bypass/useGetBypassRequestDetail";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Package,
  User,
  XCircle,
} from "lucide-react";

interface ViewBypassDetailModalProps {
  open: boolean;
  onClose: () => void;
  requestId: number;
}

export default function ViewBypassDetailModal({
  open,
  onClose,
  requestId,
}: ViewBypassDetailModalProps) {
  const {
    data: detailData,
    isLoading,
    error,
  } = useGetBypassRequestDetail(requestId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl [&>button]:hidden"
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">
              Loading Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Please wait while we load the bypass request details
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !detailData?.data) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl [&>button]:hidden"
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold">
              Error Loading Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Unable to load bypass request details at this time
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-64 items-center justify-center text-red-500">
            <AlertTriangle className="h-8 w-8" />
            <span className="ml-2">Failed to load bypass request details</span>
          </div>
          <DialogFooter className="pt-6">
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const request = detailData.data;
  const workProcess = request.orderWorkProcesses[0];
  const order = workProcess?.order;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Package className="h-5 w-5" />
            Bypass Request Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Complete information about this bypass request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Request Status</Label>
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 ${getStatusColor(request.bypassStatus)}`}
            >
              {getStatusIcon(request.bypassStatus)}
              <span className="font-medium">{request.bypassStatus}</span>
              <span className="ml-auto text-xs">ID: #{request.id}</span>
            </div>
          </div>

          {order && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Order Information</Label>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-700">
                      Order Number:
                    </span>
                    <p className="mt-1 font-mono">#{order.orderNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Order Status:
                    </span>
                    <p className="mt-1">{order.orderStatus}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <User className="h-3 w-3" />
                    Customer:
                  </span>
                  <p className="mt-1">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-2">
                    <span className="mb-2 block font-medium text-gray-700">
                      Order Items:
                    </span>
                    <div className="space-y-2">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="rounded border bg-white p-3 text-sm"
                        >
                          <div className="mb-1 flex items-start justify-between">
                            <span className="font-medium">
                              {item.laundryItem.name}
                            </span>
                            <span className="text-gray-600">
                              {item.quantity} pcs | {item.weight}kg
                            </span>
                          </div>
                          {item.orderItemDetails &&
                            item.orderItemDetails.length > 0 && (
                              <div className="mt-2 text-xs text-gray-600">
                                <span className="font-medium">Details:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {item.orderItemDetails.map((detail, idx) => (
                                    <span
                                      key={idx}
                                      className="rounded bg-gray-100 px-2 py-1 text-xs"
                                    >
                                      {detail.name} ({detail.qty}x)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {workProcess && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Work Process Details
              </Label>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-700">Station:</span>
                    <div className="mt-1">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {workProcess.workerType}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="flex items-center gap-1 font-medium text-gray-700">
                      <User className="h-3 w-3" />
                      Worker:
                    </span>
                    <p className="mt-1">
                      {workProcess.employee.user.firstName}{" "}
                      {workProcess.employee.user.lastName}
                    </p>
                  </div>
                </div>
                {workProcess.notes && (
                  <div className="border-t border-gray-200 pt-2">
                    <span className="font-medium text-gray-700">
                      Worker Notes:
                    </span>
                    <div className="mt-1 rounded border bg-white p-2 text-sm">
                      {workProcess.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Bypass Reason
            </Label>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-gray-700">{request.reason}</p>
            </div>
          </div>

          {request.adminNote && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Admin Response</Label>
              <div
                className={`rounded-lg border p-4 ${
                  request.bypassStatus === "APPROVED"
                    ? "border-green-200 bg-green-50"
                    : request.bypassStatus === "REJECTED"
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className="text-sm text-gray-700">{request.adminNote}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Outlet Information
            </Label>
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium text-gray-700">
                    Outlet Name:
                  </span>
                  <p className="mt-1">
                    {request.approvedByEmployee.outlet.outletName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="mt-1">
                    {request.approvedByEmployee.outlet.address}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <span className="font-medium text-gray-700">
                  Responsible Admin:
                </span>
                <p className="mt-1">
                  {request.approvedByEmployee.user.firstName}{" "}
                  {request.approvedByEmployee.user.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {request.approvedByEmployee.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Timeline
            </Label>
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Created:</span>
                <span className="text-gray-600">
                  {formatDate(request.createdAt)}
                </span>
              </div>
              {request.updatedAt !== request.createdAt && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Last Updated:
                  </span>
                  <span className="text-gray-600">
                    {formatDate(request.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse space-y-2 space-y-reverse pt-6 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
