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
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface User {
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface Notification {
  id: number;
  user: User;
  message: string;
  project: string;
  category: string;
  timeAgo: string;
}

// Notification data
const notifications: Notification[] = [
  {
    id: 1,
    user: {
      name: "Terry Franci",
      avatar: "/images/user/user-02.jpg",
      isOnline: true,
    },
    message: "requests permission to change",
    project: "Project - Nganter App",
    category: "Project",
    timeAgo: "5 min ago",
  },
  {
    id: 2,
    user: {
      name: "Alena Franci",
      avatar: "/images/user/user-03.jpg",
      isOnline: true,
    },
    message: "requests permission to change",
    project: "Project - Nganter App",
    category: "Project",
    timeAgo: "8 min ago",
  },
  {
    id: 3,
    user: {
      name: "Jocelyn Kenter",
      avatar: "/images/user/user-04.jpg",
      isOnline: true,
    },
    message: "requests permission to change",
    project: "Project - Nganter App",
    category: "Project",
    timeAgo: "15 min ago",
  },
  {
    id: 4,
    user: {
      name: "Jocelyn Kenter",
      avatar: "/images/user/user-04.jpg",
      isOnline: true,
    },
    message: "requests permission to change",
    project: "Project - Nganter App",
    category: "Project",
    timeAgo: "15 min ago",
  },
];

// User Avatar Component
const UserAvatar = ({ user }: { user: User }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative flex-shrink-0">
      <Avatar className="h-15 w-15">
        {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
        <AvatarFallback className="bg-gray-100 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ notification }: { notification: Notification }) => (
  <DropdownMenuItem className="cursor-pointer p-3">
    <div className="flex w-full gap-3">
      <UserAvatar user={notification.user} />

      <div className="flex-1 space-y-1">
        <div className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">
            {notification.user.name}
          </span>
          {" " + notification.message + " "}
          <span className="text-foreground font-medium">
            {notification.project}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{notification.category}</span>
          <span className="bg-muted-foreground/50 h-1 w-1 rounded-full" />
          <span>{notification.timeAgo}</span>
        </div>
      </div>
    </div>
  </DropdownMenuItem>
);

// Main NotificationDropdown Component
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && hasUnread) {
      setHasUnread(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0">
              {notifications.length}
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
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-80">
          <div className="p-1">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem notification={notification} />
                {index < notifications.length - 1 && (
                  <DropdownMenuSeparator className="mx-3" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center" asChild>
            <Link href="/notifications">View All Notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
