"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";
import useGetTodayAttendance from "@/hooks/api/employee/attendance/useGetTodayAttendance";
import useGetDriverJobs, {
  useGetDriverJobsProps,
} from "@/hooks/api/employee/driver/useGetDriverJob";
import { isDriver } from "@/utils/AuthRole";
import { Calendar, Clock, ClockFading, ListCheck, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { useBreadcrumb } from "./components/BreadCrumbContext";
import RecentAttendance from "./components/RecentAttendance";
import RecentOrder from "./components/RecentOrder";
import UserGreeting from "./components/UserGreeting";
import NotificationDropdown from "./notifications/Notifications";
import { Card } from "@/components/ui/card";
import { ActiveJobs } from "@/types/activeJobs";
import { PageableResponse } from "@/types/pagination";
import { UseQueryOptions } from "@tanstack/react-query";
import { ModeToggle } from "@/components/ToogleDarkMode";

const EmployeePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumb();

  // const { data: attendanceData, isLoading: isTodayAttendanceLoading } =
  //   useGetTodayAttendance();
  // const todayAttendance = attendanceData?.data?.[0] || null;
  // const hasClockedIn = !!todayAttendance && todayAttendance.clockOutAt === null;
  const { data: todayAttendanceData, isLoading: isTodayAttendanceLoading } =
    useGetTodayAttendance();

  const recentQueries = useMemo(
    () => ({
      page: 1,
      take: 6,
      sortBy: "clockOutAt",
      sortOrder: "desc",
    }),
    [],
  );
  const {
    data: recentAttendanceData,
    isPending: isRecentAttendanceLoading,
    isError: isRecentAttendanceError,
  } = useGetAttendance(recentQueries);
  const recentAttendance = recentAttendanceData?.data || [];

  const isAuthenticated = status === "authenticated";
  const isCurrentlyWorking =
    todayAttendanceData?.meta?.hasClockedIn &&
    !todayAttendanceData?.meta?.hasClockedOut;
  const showRecentOrder = isAuthenticated && isCurrentlyWorking;
  const showRecentJobs =
    isAuthenticated && (isDriver(session) || isCurrentlyWorking);

  const driverJobQueries = useMemo(
    () =>
      ({
        status: "active",
      }) as const,
    [],
  );

  const {
    data: activeJobsData,
    isLoading: isActiveJobsLoading,
    isError: isActiveJobsError,
    error: activeJobsErrorObject,
    refetch: refetchActiveJobs,
  } = useGetDriverJobs(driverJobQueries, {
    enabled: isAuthenticated && isDriver(session),
  } as UseQueryOptions<
    PageableResponse<ActiveJobs>,
    Error,
    PageableResponse<ActiveJobs>,
    [string, useGetDriverJobsProps?]
  >);

  const activeJobs = activeJobsData?.data || [];
  const totalActiveJobs = activeJobsData?.meta?.total || 0;

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/employee" }]);
  }, []);

  return (
    <div className="min-h-screen md:p-6">
      <div className="to-primary relative bg-gradient-to-br from-[#0051b3] md:h-50 md:rounded-lg dark:bg-none dark:from-gray-800 dark:to-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 md:hidden"
          style={{ backgroundImage: "url(/laundry.webp)" }}
        />
        <div
          className="absolute inset-0 hidden rounded-lg bg-cover bg-center bg-no-repeat opacity-15 md:block"
          style={{ backgroundImage: "url(/banner.svg)" }}
        />

        <div className="relative z-10">
          <div className="block h-47 p-4 md:hidden">
            <div className="flex items-center justify-between gap-3 p-2">
              <UserGreeting
                isMobile={true}
                user={session?.user || null}
                session={session}
              />
              <div className="mt-4 flex gap-2">
                <ModeToggle />
                <NotificationDropdown />
              </div>
            </div>
          </div>

          <div className="hidden px-6 py-8 md:block">
            <div className="mx-auto max-w-7xl">
              <div className="mt-4 flex items-center justify-between space-x-2 px-6">
                <UserGreeting
                  isMobile={false}
                  user={session?.user || null}
                  session={session}
                />
                <Avatar className="h-25 w-25 border-4 border-white/20">
                  <AvatarImage
                    src={`${session?.user?.profilePic}`}
                    alt="avatar"
                    className="object-cover"
                  />
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-6 min-h-[75vh] rounded-t-4xl bg-white md:mx-auto md:mt-0 md:min-h-0 md:max-w-7xl md:rounded-t-none md:bg-transparent md:py-8 dark:bg-[#171717]">
        <div className="block md:hidden">
          <AttendanceCard
            isMobile={true}
            attendance={todayAttendanceData}
            isLoading={isTodayAttendanceLoading}
          />
          <div className="mx-2 p-4">
            {showRecentOrder ? (
              <RecentOrder
                isLoadingJobs={isActiveJobsLoading}
                activeJobs={activeJobs}
                totalActiveJobs={totalActiveJobs}
                isErrorJobs={isActiveJobsError}
                errorJobs={activeJobsErrorObject}
                refetchJobs={refetchActiveJobs}
                isLoadingAttendance={isRecentAttendanceLoading}
                recentAttendance={recentAttendance}
                isErrorAttendance={isRecentAttendanceError}
              />
            ) : (
              <RecentAttendance
                isLoading={isRecentAttendanceLoading}
                attendance={recentAttendance}
                isError={isRecentAttendanceError}
              />
            )}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-1 md:gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AttendanceCard
              isMobile={false}
              attendance={todayAttendanceData}
              isLoading={isTodayAttendanceLoading}
            />
            {showRecentOrder ? (
              <RecentOrder
                isLoadingJobs={isActiveJobsLoading}
                activeJobs={activeJobs}
                totalActiveJobs={totalActiveJobs}
                isErrorJobs={isActiveJobsError}
                errorJobs={activeJobsErrorObject}
                refetchJobs={refetchActiveJobs}
                isLoadingAttendance={isRecentAttendanceLoading}
                recentAttendance={recentAttendance}
                isErrorAttendance={isRecentAttendanceError}
              />
            ) : (
              <RecentAttendance
                isLoading={isRecentAttendanceLoading}
                attendance={recentAttendance}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card className="space-y-3 rounded-lg border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <ListCheck /> Today's Schedule
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Shift Start
                  </span>
                  <span className="font-semibold">08:00 WIB</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Shift End
                  </span>
                  <span className="font-semibold">17:00 WIB</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Break Time
                  </span>
                  <span className="font-semibold">12:00 - 13:00</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 rounded-lg border-0 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <ClockFading /> Quick Actions
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/employee/job-history")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Job History
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/employee/attendance")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Attendance History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
