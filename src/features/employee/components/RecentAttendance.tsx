"use client";

import { Button } from "@/components/ui/button";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";
import { Attendance } from "@/types/attendance";
import { Clock, Ghost, RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RecentAttendance() {
  const router = useRouter();

  const {
    data: attendanceData,
    isPending,
    isLoading,
    isError,
  } = useGetAttendance({
    page: 1,
    take: 6,
    sortBy: "clockOutAt",
  });

  const attendance = attendanceData?.data || [];
  const hasClockedIn = !!attendanceData?.data?.[0]?.clockInAt;
  const hasClockedOut = !!attendanceData?.data?.[0]?.clockOutAt;
  const handleClick = () => {
    router.push("/employee/attendance");
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-xl bg-gray-50/50 p-3"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-3 w-14 rounded bg-gray-200" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isPending || isLoading) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-4 shadow-sm md:max-w-full">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Attendance
          </h2>
          <Button
            variant="ghost"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
            onClick={handleClick}
          >
            View all
          </Button>
        </div>
        {renderSkeleton()}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border-0 bg-white p-4 shadow-sm md:max-w-full">
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Attendance
            </h2>
            <Button
              variant="ghost"
              className="justify-end text-sm font-medium text-blue-600 hover:text-blue-700"
              onClick={handleClick}
            >
              View all
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-red-500">Error loading attendance</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-lg border-0 bg-white p-4 shadow-sm md:max-w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Attendance
          </h2>
          <Button
            variant="ghost"
            className="justify-end text-sm font-medium text-blue-600 hover:text-blue-700"
            onClick={handleClick}
          >
            View all
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {Array.isArray(attendance) && attendance.length > 0 ? (
          attendance
            .flatMap((attendanceItem: Attendance) => {
              const logs = [];

              if (attendanceItem.clockInAt) {
                logs.push({
                  id: `${attendanceItem.id}-in`,
                  title: "Clock In",
                  timestamp: attendanceItem.clockInAt,
                  icon: Clock,
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                });
              }

              if (attendanceItem.clockOutAt) {
                logs.push({
                  id: `${attendanceItem.id}-out`,
                  title: "Clock Out",
                  timestamp: attendanceItem.clockOutAt,
                  icon: RotateCcw,
                  iconBg: "bg-green-50",
                  iconColor: "text-green-600",
                });
              }

              return logs;
            })
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .slice(0, 6)
            .map((logItem) => {
              const date = new Date(logItem.timestamp);
              const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const formattedTime = date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              let status: string | null = null;

              if (logItem.title === "Clock In") {
                const hour = date.getHours();
                const minute = date.getMinutes();
                const isLate = hour > 8 || (hour === 8 && minute > 0);
                status = isLate ? "Late" : "On Time";
              }

              if (logItem.title === "Clock Out") {
                const hour = date.getHours();
                const minute = date.getMinutes();
                const isEarly = hour < 17 || (hour === 17 && minute === 0);
                status = isEarly ? "Early Leave" : "On Time";
              }

              const statusColor =
                status === "Late" || status === "Early Leave"
                  ? "text-gray-500"
                  : "text-gray-500";

              return (
                <div
                  key={logItem.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${logItem.iconBg}`}
                  >
                    <logItem.icon className={`h-5 w-5 ${logItem.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {logItem.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-900">
                        {formattedTime}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-gray-500">{formattedDate}</p>
                      <span className={`text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
            <Ghost className="h-4 w-4" />
            No attendance records found
          </div>
        )}
      </div>
    </div>
  );
}
