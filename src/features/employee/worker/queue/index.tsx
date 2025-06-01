"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";

const QueuePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Queue" },
    ]);
  }, [setBreadcrumbs]);
  return <div>QueuePage</div>;
};

export default QueuePage;
