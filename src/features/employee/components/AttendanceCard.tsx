"use client";

import { Button } from "@/components/ui/button";
import useClockIn from "@/hooks/api/employee/attendance/useClockIn";
import useClockOut from "@/hooks/api/employee/attendance/useClockOut";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, ClockFading, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

interface AttendanceCardProps {
  isMobile: boolean;
  attendance: any;
  isLoading?: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  isMobile,
  attendance,
  isLoading,
}) => {
  const { mutate: clockIn, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOut, isPending: isClockingOut } = useClockOut();

  if (isLoading) {
    return (
      <div className="mx-5 mt-6 rounded-lg border-0 bg-white p-4 shadow-sm md:mx-0 md:mt-0 dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="mb-4 h-8 rounded bg-gray-200"></div>
          <div className="h-20 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const handleClockIn = () => {
    clockIn(undefined, {
      onSuccess: () => {
        toast.success("Clock In successful");
      },
      onError: () => {
        toast.error("Failed to Clock In");
      },
    });
  };

  const handleClockOut = () => {
    clockOut(undefined, {
      onSuccess: (data) => {
        toast.success("Clock Out successful");
      },
      onError: (error) => {
        toast.error("Failed to Clock Out");
      },
    });
  };

  const getLastTimeInfo = () => {
    if (attendance?.meta?.hasClockedOut) {
      return {
        label: "Today Clock Out",
        time: attendance?.data?.clockOutAt,
      };
    } else if (attendance?.meta?.hasClockedIn) {
      return {
        label: "Today Clock In",
        time: attendance?.data?.clockInAt,
      };
    } else {
      return {
        label: "No Record Today",
        time: null,
      };
    }
  };

  const lastTimeInfo = getLastTimeInfo();
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not recorded";
    return format(new Date(timeString), "HH:mm");
  };
  const actionButton = (() => {
    if (attendance?.meta?.hasClockedIn && attendance?.meta?.hasClockedOut) {
      return (
        <Button disabled className="cursor-not-allowed bg-gray-400 text-white">
          <Clock className="mr-2 h-4 w-4" />
          Completed Today
        </Button>
      );
    }

    if (attendance?.meta?.hasClockedIn && !attendance?.meta?.hasClockedOut) {
      return (
        <Button
          onClick={handleClockOut}
          disabled={isClockingOut}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isClockingOut ? "Clocking Out..." : "Clock Out"}
        </Button>
      );
    }

    return (
      <Button onClick={handleClockIn} disabled={isClockingIn}>
        <LogIn className="mr-2 h-4 w-4" />
        {isClockingIn ? "Clocking In..." : "Clock In"}
      </Button>
    );
  })();

  if (isMobile) {
    return (
      <div className="mx-2 p-4">
        <div className="relative mt-4 items-center justify-between overflow-visible rounded-xl bg-gradient-to-br from-[#0079f2] to-[#0080FF] p-4 text-white shadow-sm">
          <ClockFading className="absolute top-0 right-0 z-20 h-20 w-20 translate-x-1/6 -translate-y-1/4 text-white/15" />
          <div>
            <p className="font-semibold">Take Attendance Today</p>
            <p className="text-sm">
              {lastTimeInfo.label}:{" "}
              <span className="font-semibold">
                {lastTimeInfo.time
                  ? formatTime(lastTimeInfo.time)
                  : "No record today"}
              </span>
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center space-x-4 rounded-lg text-sm text-black">
            <Button
              variant="ghost"
              className="flex-1 items-center justify-center gap-2 bg-white text-sm disabled:opacity-90"
              onClick={handleClockIn}
              disabled={isClockingIn || attendance?.meta?.hasClockedIn}
            >
              <LogIn className="mr-2 h-6 w-6 text-[#0080FF]" />
              {isClockingIn ? "Clocking In..." : "Clock In"}
            </Button>
            <Button
              variant="ghost"
              className="flex-1 items-center justify-center gap-2 bg-white text-sm disabled:opacity-90"
              onClick={handleClockOut}
              disabled={isClockingOut || attendance?.meta?.hasClockedOut}
            >
              <LogOut className="mr-2 h-6 w-6 rotate-180 text-red-600" />
              {isClockingOut ? "Clocking Out..." : "Clock Out"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="pb-4">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Clock />
          Attendance Today
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {attendance?.meta?.hasClockedIn && !attendance?.meta?.hasClockedOut
              ? "Ready to Clock Out?"
              : attendance?.meta?.hasClockedIn &&
                  attendance?.meta?.hasClockedOut
                ? "Already Completed Today"
                : "Ready to Clock In?"}
          </p>
          <p className="text-sm">
            {lastTimeInfo.label}:{" "}
            <span className="font-semibold">
              {lastTimeInfo.time
                ? formatTime(lastTimeInfo.time)
                : "No record today"}
            </span>
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
