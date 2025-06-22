import type React from "react";
import { Camera, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Job, type DriverJobResponse } from "@/types/detailApi";
import { DriverTaskStatus } from "@/types/enum";

interface ActionButtonsProps {
  job: Job;
  jobData: DriverJobResponse;
  startJobMutation: any;
  completeJobMutation: any;
  isStartJobDialogOpen: boolean;
  setIsStartJobDialogOpen: (open: boolean) => void;
  isCompleteDialogOpen: boolean;
  setIsCompleteDialogOpen: (open: boolean) => void;
  startJob: () => Promise<void>;
  formik: any;
}

export default function ActionButtonsDriver({
  job,
  jobData,
  startJobMutation,
  completeJobMutation,
  isStartJobDialogOpen,
  setIsStartJobDialogOpen,
  isCompleteDialogOpen,
  setIsCompleteDialogOpen,
  startJob,
  formik,
}: ActionButtonsProps) {
  const taskType = jobData.type === "pickup" ? "Pickup" : "Delivery";
  const isLoading = startJobMutation.isPending || completeJobMutation.isPending;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    formik.setFieldValue("photo", file);
  };

  if (job.status === DriverTaskStatus.COMPLETED) {
    return (
      <div className="fixed right-0 bottom-0 left-0 p-4 md:static md:bg-transparent md:p-0">
        <div className="flex items-center justify-center gap-2 text-green-600 md:p-5">
          <CheckCircle className="h-5 w-5" />
          <span className="font-lg md:font-xl">
            {taskType} Completed Successfully!
          </span>
        </div>
      </div>
    );
  }

  switch (job.status) {
    case DriverTaskStatus.ASSIGNED:
      return (
        <div className="fixed right-0 bottom-0 left-0 space-y-2 border-t p-4 md:static md:mx-4 md:mb-4 md:border-t-0 md:bg-transparent md:p-0">
          <Dialog
            open={isStartJobDialogOpen}
            onOpenChange={setIsStartJobDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={isLoading}>
                <MapPin className="mr-2 h-4 w-4" />
                Start {taskType}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start {taskType} Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert>
                  <MapPin className="h-4 w-4" />
                  <AlertDescription>
                    Are you ready to start the {taskType.toLowerCase()} job?
                    Prepare your vehicle for the {taskType.toLowerCase()}.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsStartJobDialogOpen(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startJob}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Starting..." : `Start ${taskType}`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );

    case DriverTaskStatus.IN_PROGRESS:
      return (
        <div className="fixed right-0 bottom-0 left-0 border-t p-4 md:static md:mx-4 md:mb-4 md:border-t-0 md:bg-transparent md:p-0">
          <Dialog
            open={isCompleteDialogOpen}
            onOpenChange={setIsCompleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={isLoading}>
                <Camera className="mr-2 h-4 w-4" />
                Complete {taskType}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete {taskType}</DialogTitle>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Alert>
                  <Camera className="h-4 w-4" />
                  <AlertDescription>
                    Please upload photos and add notes to complete the{" "}
                    {taskType.toLowerCase()}.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="photo">Upload Photo *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a photo as proof of {taskType.toLowerCase()}{" "}
                    completion (Required)
                  </p>
                </div>

                {formik.values.photo && (
                  <div>
                    <Label>Selected Photo</Label>
                    <div className="mt-2">
                      <div className="relative inline-block">
                        <Image
                          src={
                            URL.createObjectURL(formik.values.photo) ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt="Selected photo"
                          width={200}
                          height={150}
                          className="h-32 w-48 rounded border object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => formik.setFieldValue("photo", null)}
                          type="button"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={`Add notes about the ${taskType.toLowerCase()}...`}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: Add any relevant notes or observations
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCompleteDialogOpen(false);
                      formik.resetForm();
                    }}
                    className="flex-1"
                    disabled={isLoading}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!formik.values.photo || isLoading}
                  >
                    {isLoading ? "Completing..." : `Complete ${taskType}`}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      );
    default:
      return null;
  }
}
