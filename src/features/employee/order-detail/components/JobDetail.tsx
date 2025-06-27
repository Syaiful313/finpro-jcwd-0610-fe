"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import useCompleteDelivery from "@/hooks/api/employee/driver/useCompleteDelivery";
import useCompletePickUp from "@/hooks/api/employee/driver/useCompletePickUp";
import useStartDelivery from "@/hooks/api/employee/driver/useStartDelivery";
import useStartPickUp from "@/hooks/api/employee/driver/useStartPickUp";
import {
  type DriverJobResponse,
  type Job,
  formatFullAddress,
  getCustomerName,
} from "@/types/detailApi";
import { DriverTaskStatus } from "@/types/enum";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import ActionButtonsDriver from "./ActionButtonDriver";
import CustomerInfoCard from "./CustomerInfoCard";
import JobHeader from "./JobHeader";
import JobStatusCard from "./JobStatusCard";
import LocationCard from "./LocationCard";
import OrderDetailsCard from "./OrderDetailsCard";
import StatusProgress from "./StatusProgress";
import { AxiosError } from "axios";

interface DriverOrderDetailPageProps {
  jobData: DriverJobResponse;
}

interface CompleteJobFormValues {
  notes: string;
  photo: File | null;
}

export default function JobDetailsTry({ jobData }: DriverOrderDetailPageProps) {
  const [job, setJob] = useState<Job>(jobData.job);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isStartJobDialogOpen, setIsStartJobDialogOpen] = useState(false);

  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumb();

  const startPickUpMutation = useStartPickUp();
  const startDeliveryMutation = useStartDelivery();
  const completePickUpMutation = useCompletePickUp(job.id);
  const completeDeliveryMutation = useCompleteDelivery(job.id);

  const startJobMutation =
    jobData.type === "pickup" ? startPickUpMutation : startDeliveryMutation;
  const completeJobMutation =
    jobData.type === "pickup"
      ? completePickUpMutation
      : completeDeliveryMutation;

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Details" },
    ]);
  }, [setBreadcrumbs]);

  const initialValues: CompleteJobFormValues = {
    notes: job.notes || "",
    photo: null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.photo) {
        toast.error("Please upload a photo to complete the task.");
        return;
      }

      try {
        if (jobData.type === "pickup") {
          await completePickUpMutation.mutateAsync({
            notes: values.notes,
            pickUpPhotos: values.photo,
          });
        } else {
          await completeDeliveryMutation.mutateAsync({
            notes: values.notes,
            deliveryPhotos: values.photo,
          });
        }

        setJob((prev) => ({
          ...prev,
          status: DriverTaskStatus.COMPLETED,
          notes: values.notes,
        }));

        setIsCompleteDialogOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error completing job:", error);
      }
    },
  });

  const startJob = async () => {
    try {
      await startJobMutation.mutateAsync(job.id);
      setJob((prev) => ({
        ...prev,
        status: DriverTaskStatus.IN_PROGRESS,
      }));
      setIsStartJobDialogOpen(false);
    } catch (error) {
      console.error("Error starting job:", error);
    }
  };

  const addressInfo = formatFullAddress(job.order);
  const coordinates = {
    latitude: job.order.latitude,
    longitude: job.order.longitude,
  };
  const customerName = getCustomerName(jobData.job);
  const customerPhone = job.order.user.phoneNumber;

  const copyAddress = () => {
    navigator.clipboard.writeText(addressInfo.fullAddress);
    toast("Address copied to clipboard!");
  };

  const callCustomer = () => {
    window.open(`tel:${customerPhone}`);
  };

  const startNavigation = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <JobHeader job={job} router={router} />

      <StatusProgress job={job} />

      <CustomerInfoCard
        customerName={customerName}
        customerPhone={customerPhone}
        addressInfo={addressInfo}
        job={job}
        jobData={jobData}
        copyAddress={copyAddress}
        callCustomer={callCustomer}
      />

      <LocationCard
        coordinates={coordinates}
        addressInfo={addressInfo}
        startNavigation={startNavigation}
      />

      {jobData.type === "delivery" && <OrderDetailsCard job={job} />}

      <JobStatusCard job={job} jobData={jobData} />

      <ActionButtonsDriver
        job={job}
        jobData={jobData}
        startJobMutation={startJobMutation}
        completeJobMutation={completeJobMutation}
        isStartJobDialogOpen={isStartJobDialogOpen}
        setIsStartJobDialogOpen={setIsStartJobDialogOpen}
        isCompleteDialogOpen={isCompleteDialogOpen}
        setIsCompleteDialogOpen={setIsCompleteDialogOpen}
        startJob={startJob}
        formik={formik}
      />
    </div>
  );
}
