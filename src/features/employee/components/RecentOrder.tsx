import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListCheckIcon } from "lucide-react";
import React from "react";

const RecentOrder = () => {
  return (
    <div className="space-y-6 rounded-md border p-6 shadow-sm">
      <div>
        <div>
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <ListCheckIcon className="h-5 w-5" />
            Recent Orders
          </div>
          <p className="text-muted-foreground">View recent orders here </p>
        </div>
        <CardContent className="space-y-6"></CardContent>
      </div>
    </div>
  );
};

export default RecentOrder;
