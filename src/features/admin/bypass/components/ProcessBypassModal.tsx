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
import { Textarea } from "@/components/ui/textarea";
import { BypassRequest } from "@/types/bypass";
import { useFormik } from "formik";
import { Check, Loader2, X } from "lucide-react";
import * as Yup from "yup";

interface ProcessBypassModalProps {
  open: boolean;
  onClose: () => void;
  request: BypassRequest;
  type: "approve" | "reject";
  onConfirm: (adminNote: string) => void;
  isProcessing: boolean;
}

const validationSchema = Yup.object({
  adminNote: Yup.string()
    .required("Admin note is required")
    .max(500, "Admin note must not exceed 500 characters")
    .min(1, "Admin note cannot be empty"),
});

export default function ProcessBypassModal({
  open,
  onClose,
  request,
  type,
  onConfirm,
  isProcessing,
}: ProcessBypassModalProps) {
  const formik = useFormik({
    initialValues: {
      adminNote: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onConfirm(values.adminNote.trim());
    },
  });

  const handleClose = () => {
    if (!isProcessing) {
      formik.resetForm();
      onClose();
    }
  };

  const isApprove = type === "approve";
  const ActionIcon = isApprove ? Check : X;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[500px] [&>button]:hidden"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <div
              className={`rounded-full p-2 ${isApprove ? "bg-green-100" : "bg-red-100"}`}
            >
              <ActionIcon
                className={`h-5 w-5 ${isApprove ? "text-green-600" : "text-red-600"}`}
              />
            </div>
            {isApprove ? "Approve" : "Reject"} Bypass Request
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isApprove
              ? "Provide approval note for this bypass request"
              : "Provide rejection reason for this bypass request"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 font-medium text-gray-900">Request Details</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Order:</span>
                <span>
                  #{request.orderWorkProcesses[0]?.order?.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Station:</span>
                <span>{request.orderWorkProcesses[0]?.workerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Worker:</span>
                <span>
                  {request.orderWorkProcesses[0]?.employee?.user?.firstName}{" "}
                  {request.orderWorkProcesses[0]?.employee?.user?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>
                  {request.orderWorkProcesses[0]?.order?.user?.firstName}{" "}
                  {request.orderWorkProcesses[0]?.order?.user?.lastName}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t border-gray-200 pt-3">
              <span className="font-medium text-gray-700">Reason:</span>
              <p className="mt-1 rounded border bg-white p-2 text-sm text-gray-600">
                {request.reason}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminNote" className="text-sm font-medium">
              Admin Note *
            </Label>
            <Textarea
              id="adminNote"
              name="adminNote"
              placeholder={`Enter your ${type === "approve" ? "approval" : "rejection"} note...`}
              value={formik.values.adminNote}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className="resize-none"
              disabled={isProcessing}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formik.values.adminNote.length}/500 characters</span>
              {formik.values.adminNote.length > 500 && (
                <span className="text-red-500">Character limit exceeded</span>
              )}
            </div>
            {formik.touched.adminNote && formik.errors.adminNote && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.adminNote}
              </p>
            )}
            <p className="text-muted-foreground text-xs">
              Provide clear explanation for your{" "}
              {type === "approve" ? "approval" : "rejection"} decision
            </p>
          </div>
        </form>

        <DialogFooter className="flex flex-col-reverse space-y-2 space-y-reverse pt-6 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => formik.handleSubmit()}
            disabled={
              isProcessing || !formik.isValid || !formik.values.adminNote.trim()
            }
            className={`w-full sm:w-auto ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ActionIcon className="mr-2 h-4 w-4" />
                {isApprove ? "Approve" : "Reject"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
