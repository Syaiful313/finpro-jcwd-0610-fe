"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "../../components/BreadCrumbContext";
import TryDelivery from "./components/DeliveryRequest";
import TryDeliveryBener from "./components/DeliveryRequest";
import RequestList from "../components/RequestList";
import DeliveryRequest from "./components/DeliveryRequest";
import NotClockIn from "../../components/NotClockIn";
import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import Loader from "../../components/Loader";
import useAxios from "@/hooks/useAxios";

const DeliveryPage = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  const { data: todayAttendanceResponse, isLoading } = useGetTodayAttendance();
  const hasClockedIn = todayAttendanceResponse?.meta?.hasClockedIn ?? false;
  const hasClockedOut = todayAttendanceResponse?.meta?.hasClockedOut ?? false;
  const isCurrentlyWorking = hasClockedIn && !hasClockedOut;

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders", href: "/employee/orders" },
      { label: "Delivery" },
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
      <DeliveryRequest />
    </div>
  );
};

export default DeliveryPage;
