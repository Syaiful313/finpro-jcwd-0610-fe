"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import DetailWorkerHistory from "./DetailWorkerHistory";

const HistoryPageWorker = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const uuid = params?.uuid as string;
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Job History", href: "/employee/job-history" },
      { label: "History" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <DetailWorkerHistory uuid={uuid} />
    </div>
  );
};

export default HistoryPageWorker;
