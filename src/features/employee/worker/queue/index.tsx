"use client";

import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import useAxios from "@/hooks/useAxios";
import { useSession } from "next-auth/react";
import Loader from "../../components/Loader";
import NotClockIn from "../../components/NotClockIn";
import ListOfStationOrder from "./components/ListOfStationOrder";

const QueuePage = () => {
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
      <ListOfStationOrder />
    </div>
  );
};

export default QueuePage;
