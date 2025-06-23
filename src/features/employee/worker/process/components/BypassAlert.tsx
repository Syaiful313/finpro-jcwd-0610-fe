import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { ReactElement } from "react";

type BypassStatus = "PENDING" | "APPROVED" | "REJECTED";

interface BypassAlertProps {
  request: {
    bypassStatus: BypassStatus;
    reason: string;
    adminNote?: string | null;
  } | null;
}

const alertStyles: Record<BypassStatus, string> = {
  PENDING:
    "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  APPROVED:
    "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED:
    "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const alertIcons: Record<BypassStatus, ReactElement> = {
  PENDING: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  APPROVED: <CheckCircle className="h-4 w-4 text-green-500" />,
  REJECTED: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

export default function BypassAlert({ request }: BypassAlertProps) {
  if (!request) return null;

  const { bypassStatus, reason, adminNote } = request;

  return (
    <Alert className={alertStyles[bypassStatus]}>
      {alertIcons[bypassStatus]}
      <AlertTitle>Bypass Request Status: {bypassStatus}</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Reason: {reason}
        {adminNote && (
          <>
            <br />
            <span className="font-semibold">Admin Note:</span> {adminNote}
          </>
        )}
        {bypassStatus === "PENDING" && (
          <p className="mt-2 text-sm">
            Waiting for Outlet Admin approval to proceed.
          </p>
        )}
        {bypassStatus === "REJECTED" && (
          <p className="mt-2 text-sm font-semibold">
            Bypass was rejected. Please re-verify items or request a new bypass
            if necessary.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
