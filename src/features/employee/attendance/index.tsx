"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import Desktop from "./components/Desktop";
import Mobile from "./components/Mobile";

const AttendancePage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile: boolean = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Attendance" },
    ]);
  }, [setBreadcrumbs]);

  return isMobile ? <Mobile /> : <Desktop />;
};

export default AttendancePage;
