"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import DeliveryHistoryPage from "./components/DeliveryHistory";

const DeliveryPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Delivery" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <DeliveryHistoryPage />
    </div>
  );
};

export default DeliveryPage;
