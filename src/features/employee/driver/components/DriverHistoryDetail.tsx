"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import useGetDriverHistoryDetail from "@/hooks/api/employee/driver/useGetDriverHistoryDetail";

import { useBreadcrumb } from "@/features/employee/components/BreadCrumbContext";
import Loader from "../../components/Loader";
import DriverJobDetailPage from "./DriverJobDetailPage";

export default function DriverJobHistoryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { setBreadcrumbs } = useBreadcrumb();

  const jobId = params?.jobId;
  const jobType = searchParams.get("type") as "pickup" | "delivery";

  const isValidJobType = jobType === "pickup" || jobType === "delivery";

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Job History", href: "/employee/job-history" },
      { label: "Job Detail" },
    ]);
  }, [setBreadcrumbs]);

  const {
    data: jobDetail,
    isLoading,
    isError,
    error,
  } = useGetDriverHistoryDetail({
    jobId: Number(jobId),
    type: isValidJobType ? jobType : "pickup",
  });

  if (!jobId || !isValidJobType) {
    return <div className="p-4 text-red-500">Invalid job detail link</div>;
  }

  if (isLoading) return <Loader />;
  if (isError || !jobDetail)
    return <div className="p-4 text-red-500">Error: {error?.message}</div>;

  return (
    <div className="p-4">
      <DriverJobDetailPage data={jobDetail} />
    </div>
  );
}
