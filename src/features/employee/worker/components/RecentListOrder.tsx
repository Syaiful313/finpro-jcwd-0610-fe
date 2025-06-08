import { ListCheck } from "lucide-react";
import React from "react";

const RecentListOrder = () => {
  return (
    <section>
      <div>
        <div className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
          <ListCheck className="h-5 w-5" />
          Recent Orders
        </div>
        <p className="text-muted-foreground">View your recent orders here</p>
      </div>
      <div className="space-y-6"></div>
    </section>
  );
};

export default RecentListOrder;
