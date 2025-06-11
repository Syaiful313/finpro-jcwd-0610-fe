import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-4">
      <div className="text-destructive flex items-center space-x-2">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Error Loading Order</span>
      </div>
      <p className="text-muted-foreground max-w-md text-center text-sm">
        {message}
      </p>
      <Button onClick={onRetry} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
