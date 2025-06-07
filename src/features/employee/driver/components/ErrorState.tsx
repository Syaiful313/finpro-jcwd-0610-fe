import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface ErrorStateProps {
  errorMessage?: string;
  onRetry: () => void;
}

const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <div>
      <Card className="py-12 text-center">
        <CardContent>
          <div className="text-destructive mx-auto mb-4 h-12 w-12 md:h-20 md:w-20">
            ⚠️
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            Failed to load requests
          </h3>
          <p className="text-muted-foreground mb-4">
            {errorMessage || "Something went wrong while fetching requests."}
          </p>
          <Button onClick={onRetry}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
