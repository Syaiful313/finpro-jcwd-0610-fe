"use client";

import { isDriver } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import ActiveJobs from "../driver/components/ActiveJobs";
import RecentListOrder from "../worker/components/RecentListOrder";

interface RecentOrderProps {
  isLoadingJobs: boolean;
  activeJobs: any[];
  totalActiveJobs: number;
  isErrorJobs: boolean;
  errorJobs: any;
  totalRequests?: number;
  refetchJobs: () => void;
  isLoadingAttendance: boolean;
  recentAttendance: any[];
  isErrorAttendance: boolean;
}

const RecentOrder = (props: RecentOrderProps) => {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 rounded-md border p-5 shadow-sm">
      {isDriver(session) ? (
        <ActiveJobs
          isLoading={props.isLoadingJobs}
          requests={props.activeJobs}
          totalRequests={props.totalActiveJobs}
          isError={props.isErrorJobs}
          error={props.errorJobs}
          refetch={props.refetchJobs}
        />
      ) : (
        <RecentListOrder />
      )}
    </div>
  );
};

export default RecentOrder;
