"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";

const PickUpPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Pick up" },
    ]);
  }, [setBreadcrumbs]);
  return <div>PickUpPage</div>;
};

export default PickUpPage;
