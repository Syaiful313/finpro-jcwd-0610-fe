"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";
import useClockIn from "@/hooks/api/employee/attendance/useClockIn";
import useClockOut from "@/hooks/api/employee/attendance/useClockOut";
import { toast } from "sonner"; // optional, pakai apapun untuk notif

interface AttendanceCardProps {
  isMobile: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ isMobile }) => {
  const { data: attendanceData, isLoading, refetch } = useGetAttendance();
  const { mutate: clockIn, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOut, isPending: isClockingOut } = useClockOut();

  const attendance = attendanceData?.data?.[0];

  const hasClockedIn = !!attendance?.clockInAt;
  const hasClockedOut = !!attendance?.clockOutAt;

  const handleClockIn = () => {
    clockIn(undefined, {
      onSuccess: () => {
        toast.success("Clock In successful");
        refetch();
      },
      onError: () => toast.error("Failed to Clock In"),
    });
  };

  const handleClockOut = () => {
    clockOut(undefined, {
      onSuccess: () => {
        toast.success("Clock Out successful");
        refetch();
      },
      onError: () => toast.error("Failed to Clock Out"),
    });
  };

  const actionButton =
    hasClockedIn && !hasClockedOut ? (
      <Button
        onClick={handleClockOut}
        disabled={isClockingOut}
        className="bg-red-600 hover:bg-red-700"
      >
        <Clock className="mr-2 h-4 w-4" />
        Clock Out
      </Button>
    ) : (
      <Button
        onClick={handleClockIn}
        disabled={isClockingIn}
        className="bg-[#0080FF] hover:bg-[#0051b3]"
      >
        <Clock className="mr-2 h-4 w-4" />
        Clock In
      </Button>
    );

  if (isMobile) {
    return (
      <div className="mx-2 p-4">
        <div className="mt-4 flex items-center justify-between rounded-lg p-4 shadow-sm">
          <div>
            <p className="font-semibold">Take Attendance Today</p>
            <p className="text-sm">
              Last Clock Out: {attendance?.clockOutAt || "-"}
            </p>
          </div>
          {actionButton}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="pb-4">
        <div className="flex items-center text-xl">
          <Clock className="mr-2 h-5 w-5 text-[#0080FF]" />
          Attendance Today
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {hasClockedIn && !hasClockedOut
              ? "Ready to Clock Out?"
              : "Ready to Clock In?"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Last Clock Out: {attendance?.clockOutAt || "-"}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        {actionButton}
      </div>
    </div>
  );
};

export default AttendanceCard;
