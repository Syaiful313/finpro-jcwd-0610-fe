import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeleton = () => (
  <div className="p-3">
    <div className="flex gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);
export default NotificationSkeleton;
