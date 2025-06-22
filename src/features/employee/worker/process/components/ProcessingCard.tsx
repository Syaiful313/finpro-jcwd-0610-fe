import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, CreditCard, LucideIcon } from "lucide-react";
import { PaymentStatus } from "@/types/enum";

interface ProcessingCardProps {
  currentConfig: {
    title: string;
    icon: LucideIcon;
    color: string;
  };
  notes: string;
  setNotes: (value: string) => void;
  onComplete: () => void;
  isDisabled: boolean;
  isPending: boolean;
  isCompleted: boolean;
  paymentStatus: PaymentStatus;
}

export default function ProcessingCard({
  currentConfig,
  notes,
  setNotes,
  onComplete,
  isDisabled,
  isPending,
  isCompleted,
  paymentStatus,
}: ProcessingCardProps) {
  const IconComponent = currentConfig.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <IconComponent
              className={`h-5 w-5 ${!isDisabled ? `text-${currentConfig.color}-500` : "text-gray-400"}`}
            />
          )}
          {currentConfig.title}
          {isCompleted && (
            <Badge variant="default" className="ml-2">
              Completed
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isCompleted
            ? `${currentConfig.title} process has been completed.`
            : isDisabled
              ? `Waiting for item verification to complete first.`
              : `Complete the ${currentConfig.title.toLowerCase()} process.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert
          className={
            paymentStatus === "PAID"
              ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400/30 dark:bg-green-900/30 dark:text-green-300"
              : "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-900/30 dark:text-amber-300"
          }
        >
          <CreditCard className="h-4 w-4" />
          <AlertDescription className="text-muted-foreground">
            Payment Status:
            <Badge variant={paymentStatus === "PAID" ? "default" : "secondary"}>
              {paymentStatus === "PAID" ? "Paid" : "Waiting for Payment"}
            </Badge>
          </AlertDescription>
        </Alert>

        <div>
          <Label className="mb-2">Processing Notes</Label>
          <Textarea
            placeholder={`Add any ${currentConfig.title.toLowerCase()} notes...`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isDisabled || isCompleted}
          />
        </div>

        <Button
          onClick={onComplete}
          className="w-full"
          disabled={isDisabled || isCompleted || isPending}
        >
          {isCompleted
            ? "Process Completed"
            : isPending
              ? "Completing..."
              : `Complete ${currentConfig.title}`}
        </Button>

        {isCompleted && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              {currentConfig.title} process has been successfully completed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
