"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import AttendanceList from "./components/AttendanceList";

const AttendancePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Attendance" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div>
      <AttendanceList />
    </div>
  );
};

export default AttendancePage;
