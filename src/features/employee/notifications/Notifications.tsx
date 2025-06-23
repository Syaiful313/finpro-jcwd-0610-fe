"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetDriverNotifications from "@/hooks/api/employee/driver/useGetDriverNotifications";
import useGetWorkerNotification from "@/hooks/api/employee/worker/useGetWorkerNotification";
import useMarkAllAsRead from "@/hooks/api/notification/useMarkAllAsRead";
import useMarkAsRead from "@/hooks/api/notification/useMarkAsRead";
import { NotificationResponse } from "@/types/DriverNotification";
import { isDriver, isWorker } from "@/utils/AuthRole";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import NotificationSkeleton from "./NotificationSkeleton";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const userRole = useMemo(() => {
    if (!session) return null;
    if (isDriver(session)) return "driver";
    if (isWorker(session)) return "worker";
    return null;
  }, [session]);

  const currentUserId = session?.user?.id;

  const { mutate: markNotificationAsRead, isPending: isMarkingRead } =
    useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const driverQuery = useGetDriverNotifications({
    enabled: userRole === "driver",
  });

  const workerQuery = useGetWorkerNotification({
    enabled: userRole === "worker",
  });

  let activeQuery;
  if (userRole === "driver") {
    activeQuery = driverQuery;
  } else if (userRole === "worker") {
    activeQuery = workerQuery;
  } else {
    activeQuery = { data: null, isLoading: false, error: null };
  }

  const { data, isLoading, error } = activeQuery;

  const notifications = data?.data || [];

  const isNotificationRead = (notification: NotificationResponse) => {
    if (!currentUserId) return false;
    return notification.readByUserIds.includes(currentUserId);
  };

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notif: NotificationResponse) => !isNotificationRead(notif),
      ).length,
    [notifications, currentUserId],
  );

  const [markingIds, setMarkingIds] = useState<Set<number>>(new Set());
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleMarkAsRead = (notificationId: number) => {
    setMarkingIds((prev) => new Set([...prev, notificationId]));
    markNotificationAsRead(notificationId, {
      onSettled: () => {
        setMarkingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (!session || !userRole) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <ScrollArea className="h-80">
          <div className="p-1">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-3">
                  <NotificationSkeleton />
                </div>
              ))
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Failed to load notifications
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="text-muted-foreground/50 mx-auto mb-3 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map(
                (notification: NotificationResponse, index: number) => {
                  const timeAgo = formatDistanceToNow(
                    new Date(notification.createdAt),
                    {
                      addSuffix: true,
                      locale: enUS,
                    },
                  );

                  const isRead = isNotificationRead(notification);

                  return (
                    <div key={notification.id}>
                      <div
                        className={`p-3 ${!isRead ? "bg-input rounded-sm" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs leading-5 ${
                                !isRead
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                {timeAgo}
                              </span>
                              {!isRead && (
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>

                          {!isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={isMarkingRead}
                              className="h-8 w-8 flex-shrink-0 p-0 hover:bg-blue-100"
                            >
                              {markingIds.has(notification.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              ) : (
                                <Check className="text-primary h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < notifications.length - 1 && (
                        <DropdownMenuSeparator className="mx-3" />
                      )}
                    </div>
                  );
                },
              )
            )}
          </div>
        </ScrollArea>

        {unreadCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
              >
                {isMarkingAll ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCheck className="mr-2 h-4 w-4" />
                )}
                {isMarkingAll ? "Marking..." : "Mark All as Read"}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
