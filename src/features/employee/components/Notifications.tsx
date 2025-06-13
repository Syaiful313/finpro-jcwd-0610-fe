"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React, { useState } from "react";
import { Bell, Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { enUS, id } from "date-fns/locale";
import { DriverNotification } from "@/types/DriverNotification";
import useGetNotifications from "@/hooks/api/employee/driver/useGetNotification";
import { NotifType } from "@/types/enum";

const getNotificationIcon = (notifType: NotifType) => {
  switch (notifType) {
    case NotifType.NEW_PICKUP_REQUEST:
      return <Package className="h-4 w-4 text-blue-500" />;
    case NotifType.NEW_DELIVERY_REQUEST:
      return <Truck className="h-4 w-4 text-green-500" />;
    case NotifType.PICKUP_COMPLETED:
    case NotifType.DELIVERY_COMPLETED:
    case NotifType.ORDER_COMPLETED:
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case NotifType.BYPASS_APPROVED:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case NotifType.BYPASS_REJECTED:
    case NotifType.BYPASS_REQUEST:
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getCustomerInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const formatNotificationMessage = (notification: DriverNotification) => {
  const customerName = notification.order?.user.firstName
    ? `${notification.order.user.firstName} ${notification.order.user.lastName}`
    : "Customer";
  return notification.message;
};

// Helper function to get notification category
const getNotificationCategory = (notifType: NotifType) => {
  switch (notifType) {
    case NotifType.NEW_PICKUP_REQUEST:
    case NotifType.PICKUP_COMPLETED:
      return "Pickup";
    case NotifType.NEW_DELIVERY_REQUEST:
    case NotifType.DELIVERY_COMPLETED:
      return "Delivery";
    case NotifType.ORDER_COMPLETED:
      return "Order";
    case NotifType.BYPASS_REQUEST:
    case NotifType.BYPASS_APPROVED:
    case NotifType.BYPASS_REJECTED:
      return "Bypass";
    default:
      return "System";
  }
};

// User Avatar Component
const CustomerAvatar = ({
  notification,
}: {
  notification: DriverNotification;
}) => {
  if (!notification.order?.user) {
    return (
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            SY
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  const { firstName, lastName } = notification.order.user;

  return (
    <div className="relative flex-shrink-0">
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {getCustomerInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 dark:bg-gray-800">
        {getNotificationIcon(notification.notifType)}
      </div>
    </div>
  );
};

const NotificationItem = ({
  notification,
}: {
  notification: DriverNotification;
}) => {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: enUS,
  });

  return (
    <DropdownMenuItem
      className={`cursor-pointer p-3 ${!notification.isRead ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
    >
      <div className="flex w-full gap-3">
        <div className="flex-1 space-y-1">
          <div className="text-sm">
            <p className="text-foreground leading-5 font-medium">
              {formatNotificationMessage(notification)}
            </p>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>{getNotificationCategory(notification.notifType)}</span>
            <span className="bg-muted-foreground/50 h-1 w-1 rounded-full" />
            <span>{timeAgo}</span>
            {!notification.isRead && (
              <>
                <span className="bg-muted-foreground/50 h-1 w-1 rounded-full" />
                <span className="font-medium text-blue-600">New</span>
              </>
            )}
          </div>
        </div>
      </div>
    </DropdownMenuItem>
  );
};

// Loading Skeleton Component
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

// Main NotificationDropdown Component
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetNotifications({
    page: 1,
    take: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const unreadCount =
    data?.data?.filter((notif: DriverNotification) => !notif.isRead).length ||
    0;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

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
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DropdownMenuLabel className="p-0 text-lg font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-80">
          <div className="p-1">
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <NotificationSkeleton />
                  {index < 2 && <DropdownMenuSeparator className="mx-3" />}
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  Failed to load notifications
                </p>
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              // Empty state
              <div className="p-4 text-center">
                <Bell className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              // Notifications list
              data.data.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < data.data.length - 1 && (
                    <DropdownMenuSeparator className="mx-3" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center" asChild>
            <Link href="/notifications">Mark All As Read</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
