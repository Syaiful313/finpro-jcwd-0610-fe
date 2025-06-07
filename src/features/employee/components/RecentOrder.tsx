import { isDriver } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import ActiveJobs from "../driver/components/ActiveJobs";
import RecentListOrder from "../worker/components/RecentListOrder";

const RecentOrder = () => {
  const { data: session } = useSession();
  return (
    <div className="space-y-6 rounded-md border p-5 shadow-sm">
      {isDriver(session) ? <ActiveJobs /> : <RecentListOrder />}
    </div>
  );
};

export default RecentOrder;
