"use client";

import React, { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";

const AttendancePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Attendance" },
    ]);
  }, [setBreadcrumbs]);
  return <div>AttendancePage</div>;
};

export default AttendancePage;
