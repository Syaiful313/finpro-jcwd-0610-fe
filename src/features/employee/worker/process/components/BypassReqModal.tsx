import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

interface BypassRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  setReason: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

export default function BypassRequestModal({
  isOpen,
  onClose,
  reason,
  setReason,
  onSubmit,
  isPending,
}: BypassRequestModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Item Quantity Mismatch
          </CardTitle>
          <CardDescription>
            The quantities you entered don't match the original order. Please
            request a bypass from an admin to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bypass-reason">Reason for Discrepancy</Label>
            <Textarea
              id="bypass-reason"
              placeholder="Explain why the quantities don't match (e.g., damaged items, missing items, etc.)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1"
              disabled={isPending || !reason.trim()}
            >
              {isPending ? "Submitting..." : "Request Bypass"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
