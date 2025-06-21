import React from "react";
import RequestList from "../../driver/components/RequestList";
import TryDelivery from "../../driver/delivery/components/DeliveryRequest";
import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import NotClockIn from "../../components/NotClockIn";
import Loader from "../../components/Loader";

const DriverOrderList = () => {
  const { data: todayAttendanceResponse, isLoading } = useGetTodayAttendance();
  const hasClockedIn = todayAttendanceResponse?.meta?.hasClockedIn ?? false;
  const hasClockedOut = todayAttendanceResponse?.meta?.hasClockedOut ?? false;
  const isCurrentlyWorking = hasClockedIn && !hasClockedOut;

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (!isCurrentlyWorking) return <NotClockIn />;
  return (
    <div>
      <RequestList />
    </div>
  );
};

export default DriverOrderList;
