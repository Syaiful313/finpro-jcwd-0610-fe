"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Attendance } from "@/types/attendance";
import { Clock, Ghost, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecentAttendanceProps {
  isLoading?: boolean;
  attendance: any;
  isError?: boolean;
}

export default function RecentAttendance({
  isLoading,
  attendance,
  isError,
}: RecentAttendanceProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/employee/attendance");
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-400/50"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-200/20" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-200/20" />
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-gray-200/20" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-200/20" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-200/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-md rounded-lg p-4 shadow-sm md:max-w-full">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold">Recent Attendance</h2>
          <Button
            variant="ghost"
            className="text-primary dark:text-accent text-sm font-medium hover:text-blue-700 dark:hover:text-blue-500"
            onClick={handleClick}
          >
            View all
          </Button>
        </div>
        {renderSkeleton()}
      </Card>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm md:max-w-full dark:border-red-500/30">
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-gray-50">
              Recent Attendance
            </h2>
            <Button
              variant="ghost"
              className="justify-end text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
              onClick={handleClick}
            >
              View all
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-red-600 dark:text-red-400">
            Error loading attendance
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-lg border-0 p-4 shadow-sm md:max-w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Attendance</h2>
          <Button
            variant="ghost"
            className="justify-end text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
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
                  iconBg: "bg-blue-50 dark:bg-blue-700/30",
                  iconColor: "text-blue-600 dark:text-blue-400",
                });
              }

              if (attendanceItem.clockOutAt) {
                logs.push({
                  id: `${attendanceItem.id}-out`,
                  title: "Clock Out",
                  timestamp: attendanceItem.clockOutAt,
                  icon: RotateCcw,
                  iconBg: "bg-green-50 dark:bg-green-700/30",
                  iconColor: "text-green-600 dark:text-green-400",
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
              let statusColor = "text-gray-500 dark:text-gray-400";

              if (logItem.title === "Clock In") {
                const hour = date.getHours();
                const minute = date.getMinutes();
                const isLate = hour > 9 || (hour === 9 && minute > 0);
                status = isLate ? "Late" : "On Time";
                if (isLate) {
                  statusColor = "text-primary dark:text-orange-300";
                }
              }

              if (logItem.title === "Clock Out") {
                const hour = date.getHours();
                const minute = date.getMinutes();
                const isEarly = hour < 20 || (hour === 20 && minute === 0);
                status = isEarly ? "Early Leave" : "On Time";
                if (isEarly) {
                  statusColor = "text-primary dark:text-orange-300";
                }
              }

              return (
                <div
                  key={logItem.id}
                  className="bg-muted/50 hover:bg-muted border-muted dark:bg-input/50 dark:hover:bg-input/70 flex items-center gap-3 rounded-xl border p-3 transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${logItem.iconBg}`}
                  >
                    <logItem.icon className={`h-5 w-5 ${logItem.iconColor}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{logItem.title}</h3>
                      <span className="text-sm font-medium">
                        {formattedTime}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs">{formattedDate}</p>
                      <span className={`text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400 dark:text-gray-500">
            <Ghost className="h-4 w-4" />
            No attendance records found
          </div>
        )}
      </div>
    </Card>
  );
}
