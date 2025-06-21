"use client";

import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import Loader from "../../components/Loader";
import NotClockIn from "../../components/NotClockIn";
import ListOfBypass from "./components/ListOfBypass";

const BypassPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const { data: todayAttendanceResponse, isLoading } = useGetTodayAttendance();
  const hasClockedIn = todayAttendanceResponse?.meta?.hasClockedIn ?? false;
  const hasClockedOut = todayAttendanceResponse?.meta?.hasClockedOut ?? false;
  const isCurrentlyWorking = hasClockedIn && !hasClockedOut;
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Bypass" },
    ]);
  }, [setBreadcrumbs]);
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (!isCurrentlyWorking) return <NotClockIn />;

  return (
    <div>
      <ListOfBypass />
    </div>
  );
};

export default BypassPage;
