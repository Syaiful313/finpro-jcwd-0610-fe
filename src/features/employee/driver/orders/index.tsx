"use client";
import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";

const OrderPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders" },
    ]);
  }, [setBreadcrumbs]);

  return <div>OrderPage</div>;
};

export default OrderPage;
