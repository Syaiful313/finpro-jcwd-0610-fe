"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import PickupHistoryPage from "./components/PickUpHistory";

const PickUpPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Pick up" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <PickupHistoryPage />
    </div>
  );
};

export default PickUpPage;
