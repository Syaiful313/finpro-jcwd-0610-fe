"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Calendar,
  CalendarCheck,
  Clock,
  ClockFading,
  ListCheck,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { useBreadcrumb } from "./components/BreadCrumbContext";
import NotificationDropdown from "./components/Notifications";
import RecentAttendance from "./components/RecentAttendance";
import UserGreeting from "./components/UserGreeting";
import { isDriver, isWorker } from "@/utils/AuthRole";
import { toast } from "sonner";
import RecentOrder from "./components/RecentOrder";
import useGetAttendance from "@/hooks/api/employee/attendance/useGetAttendance";

const RecentSection: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: attendanceData } = useGetAttendance({
    page: 1,
    take: 6,
    sortBy: "clockOutAt",
  });

  // Cek attendance record terbaru (hari ini)
  const latestAttendance = attendanceData?.data?.[0];
  const hasClockedIn = !!latestAttendance?.clockInAt;
  const hasClockedOut = !!latestAttendance?.clockOutAt;

  const isCurrentlyWorking = hasClockedIn && !hasClockedOut;
  const showRecentOrder = isAuthenticated && isCurrentlyWorking;

  return showRecentOrder ? <RecentOrder /> : <RecentAttendance />;
};

const MobileLayout: React.FC = () => (
  <div>
    <div className="relative bg-gradient-to-br from-[#0051b3] to-[#0080FF]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url(/laundry.webp)" }}
      />
      <div className="relative z-10">
        <div className="h-47">
          <div className="p-4">
            <div className="flex items-center justify-between gap-3 p-2">
              <UserGreeting isMobile={true} />
              <div className="mt-4">
                <NotificationDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="relative z-10 -mt-6 min-h-[75vh] rounded-t-4xl bg-white">
      <AttendanceCard isMobile={true} />
      <div className="mx-2 p-4">
        <RecentSection />
      </div>
    </div>
  </div>
);

const DesktopLayout: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen p-6 dark:bg-gray-900">
      <div className="relative h-50 rounded-lg bg-gradient-to-br from-[#0051b3] to-[#0080FF]">
        <div
          className="absolute inset-0 rounded-lg bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: "url(/banner.svg)" }}
        />
        <div className="relative z-10 px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mt-4 flex items-center justify-between space-x-2 px-6">
              <UserGreeting isMobile={false} />
              <Avatar className="h-25 w-25 border-4 border-white/20">
                <AvatarFallback className="bg-white text-xl font-bold text-[#0080FF]">
                  J
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AttendanceCard isMobile={false} />
            <RecentSection />
          </div>

          <div className="space-y-6">
            <div className="space-y-3 rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <CalendarCheck /> This Week
              </div>
              <div className="space-y-4">
                <div className="bg-primary/10 dark:bg-primary/20 flex items-center justify-between rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days Present
                  </span>
                  <span className="text-primary dark:text-primary text-lg font-bold">
                    4/5
                  </span>
                </div>
                <div className="bg-primary/10 dark:bg-primary/20 flex items-center justify-between rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hours Worked
                  </span>
                  <span className="text-primary dark:text-primary text-lg font-bold">
                    32h
                  </span>
                </div>
                <div className="bg-primary/10 dark:bg-primary/20 flex items-center justify-between rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Order
                  </span>
                  <span className="text-primary dark:text-primary text-lg font-bold">
                    78
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
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
            </div>

            <div className="space-y-3 rounded-lg border-0 bg-white p-4 shadow-sm dark:bg-gray-800">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const EmployeePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumb();
  const isMobile: boolean = useMediaQuery("(max-width: 767px)");

  if (status === "authenticated" && !(isWorker(session) || isDriver(session))) {
    router.push("/admin/dashboard");
    toast.error("You are not authorized to access this page.");
  }

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard", href: "/employee" }]);
  }, [setBreadcrumbs]);

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default EmployeePage;
