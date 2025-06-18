"use client";

import React, { useEffect } from "react";
import ProcessOrderDetailPage from "./components/ProcessOrderPage";
import { useParams, useSearchParams } from "next/navigation";
import { useBreadcrumb } from "../../components/BreadCrumbContext";

const TryIndex = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const uuid = params?.uuid as string;
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Process" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <ProcessOrderDetailPage uuid={uuid} />
    </div>
  );
};

export default TryIndex;
