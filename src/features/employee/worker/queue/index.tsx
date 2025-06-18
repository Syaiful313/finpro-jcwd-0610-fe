"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import TryStation from "./components/TryStation";

const QueuePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Queue" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <TryStation />
    </div>
  );
};

export default QueuePage;
