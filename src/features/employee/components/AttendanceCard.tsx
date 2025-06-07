"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, ClockFading, LogIn, LogOut } from "lucide-react";
import useClockIn from "@/hooks/api/employee/attendance/useClockIn";
import useClockOut from "@/hooks/api/employee/attendance/useClockOut";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import { Separator } from "@/components/ui/separator";

interface AttendanceCardProps {
  isMobile: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ isMobile }) => {
  const { data: attendanceData, isLoading } = useGetTodayAttendance();
  const queryClient = useQueryClient();
  const { mutate: clockIn, isPending: isClockingIn } = useClockIn();
  const { mutate: clockOut, isPending: isClockingOut } = useClockOut();
  const router = useRouter();
  const attendance = attendanceData?.data?.[0];

  const hasClockedIn = !!attendance?.clockInAt;
  const hasClockedOut = !!attendance?.clockOutAt;

  const handleClockIn = () => {
    const currentTime = new Date().toISOString();

    clockIn(undefined, {
      onSuccess: (data) => {
        toast.success("Clock In successful");

        const today = format(new Date(), "yyyy-MM-dd");
        queryClient.invalidateQueries({
          queryKey: ["attendance", "today", today],
        });
        queryClient.invalidateQueries({ queryKey: ["attendance"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        router.push("/employee");
      },
      onError: (error) => {
        toast.error("Failed to Clock In");
        console.error("Clock in error:", error);
      },
    });
  };

  const handleClockOut = () => {
    clockOut(undefined, {
      onSuccess: (data) => {
        toast.success("Clock Out successful");

        const today = format(new Date(), "yyyy-MM-dd");
        queryClient.invalidateQueries({
          queryKey: ["attendance", "today", today],
        });
        queryClient.invalidateQueries({ queryKey: ["attendance"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["claimed-requests"] });

        setTimeout(() => {
          queryClient.refetchQueries({
            queryKey: ["attendance", "today", today],
          });
        }, 500);
      },
      onError: (error) => {
        toast.error("Failed to Clock Out");
        console.error("Clock out error:", error);
      },
    });
  };

  const getLastTimeInfo = () => {
    if (hasClockedOut) {
      return {
        label: "Today Clock Out",
        time: attendance?.clockOutAt,
      };
    } else if (hasClockedIn) {
      return {
        label: "Today Clock In",
        time: attendance?.clockInAt,
      };
    } else {
      return {
        label: "No Record Today",
        time: null,
      };
    }
  };

  const lastTimeInfo = getLastTimeInfo();

  const actionButton = (() => {
    if (hasClockedIn && hasClockedOut) {
      return (
        <Button disabled className="cursor-not-allowed bg-gray-400 text-white">
          <Clock className="mr-2 h-4 w-4" />
          Completed Today
        </Button>
      );
    }

    // Jika sudah clock in tapi belum clock out hari ini
    if (hasClockedIn && !hasClockedOut) {
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

    // Jika belum clock in hari ini
    return (
      <Button
        onClick={handleClockIn}
        disabled={isClockingIn}
        className="bg-[#0080FF] hover:bg-[#0051b3] disabled:opacity-50"
      >
        <LogIn className="mr-2 h-4 w-4" />
        {isClockingIn ? "Clocking In..." : "Clock In"}
      </Button>
    );
  })();

  // Loading state
  if (isLoading) {
    return (
      <div className="rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="mb-4 h-8 rounded bg-gray-200"></div>
          <div className="h-20 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="mx-2 p-4">
        <div className="relative mt-4 items-center justify-between overflow-visible rounded-xl bg-gradient-to-br from-[#0079f2] to-[#0080FF] p-4 text-white shadow-sm">
          <ClockFading className="absolute top-0 right-0 z-20 h-20 w-20 translate-x-1/6 -translate-y-1/4 text-white/15" />
          <div>
            <p className="font-semibold">Take Attendance Today</p>
            <p className="text-sm">
              {lastTimeInfo.label}:
              {lastTimeInfo.time
                ? format(new Date(lastTimeInfo.time), " dd MMMM yyyy • HH:mm")
                : "-"}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center space-x-4 rounded-lg text-sm text-black">
            <Button
              variant="ghost"
              className="flex-1 items-center justify-center gap-2 bg-white text-sm"
              onClick={handleClockIn}
            >
              <LogIn className="mr-2 h-6 w-6 text-[#0080FF]" /> Clock In
            </Button>
            <Button
              variant="ghost"
              className="flex-1 items-center justify-center gap-2 bg-white text-sm"
              onClick={handleClockOut}
            >
              <LogOut className="mr-2 h-6 w-6 rotate-180 text-red-600" /> Clock
              Out
            </Button>
          </div>
          {/* {actionButton} */}
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
            {hasClockedIn && !hasClockedOut
              ? "Ready to Clock Out?"
              : hasClockedIn && hasClockedOut
                ? "Already Completed Today"
                : "Ready to Clock In?"}
          </p>
          <p className="text-sm">
            {lastTimeInfo.label}:{" "}
            {lastTimeInfo.time
              ? format(
                  new Date(lastTimeInfo.time),
                  "eeee, dd MMMM yyyy • HH:mm",
                )
              : "-"}
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
