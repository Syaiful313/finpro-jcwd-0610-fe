"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import ListOfBypass from "./components/ListOfBypass";

const BypassPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Bypass" },
    ]);
  }, [setBreadcrumbs]);
  return (
    <div>
      <ListOfBypass />
    </div>
  );
};

export default BypassPage;
