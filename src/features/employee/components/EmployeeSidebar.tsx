"use client";

import {
  CalendarCheckIcon,
  ClockIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOut,
  PackageIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { isDriver } from "@/utils/AuthRole";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { NavDocuments } from "./NavDocument";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";

type Role = "DRIVER" | "WORKER";

interface EmployeeSidebarProps extends React.ComponentProps<typeof Sidebar> {}

const getNavDataByRole = (role: Role) => {
  const baseData = {
    user: {
      name: "Employee",
      email: "employee@example.com",
      avatar: "/avatars/employee.jpg",
    },
    reports: [
      {
        name: "Job History",
        url: "/employee/job-history",
        icon: ClockIcon,
      },
      {
        name: "Attendance",
        url: "/employee/attendance",
        icon: CalendarCheckIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "mailto:bubbilfyofficial@gmail.com",
        icon: HelpCircleIcon,
      },
    ],
  };

  if (role === "DRIVER") {
    return {
      ...baseData,
      navMain: [
        {
          title: "Dashboard",
          url: "/employee",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Order List",
          url: "/employee/orders",
          icon: ListIcon,
        },
        {
          title: "Pick Up",
          url: "/employee/orders/pick-up",
          icon: PackageIcon,
        },
        {
          title: "Delivery",
          url: "/employee/orders/delivery",
          icon: TruckIcon,
        },
      ],
    };
  } else {
    // WORKER
    return {
      ...baseData,
      navMain: [
        {
          title: "Dashboard",
          url: "/employee",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Order List",
          url: "/employee/orders",
          icon: ListIcon,
        },
        {
          title: "Queue",
          url: "/employee/orders/queue",
          icon: UsersIcon,
        },
        {
          title: "Bypass Request",
          url: "/employee/orders/bypass",
          icon: FileTextIcon,
        },
      ],
    };
  }
};

export function EmployeeSidebar({ ...props }: EmployeeSidebarProps) {
  const { data: userData } = useSession();
  const user = userData?.user;

  const role: Role = isDriver(userData) ? "DRIVER" : "WORKER";
  const data = getNavDataByRole(role);

  const handleLogout = () => {
    signOut({
      redirectTo: "/",
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="items-center pl-4">
              <Link href="/">
                <Image
                  src="/bub-logo.svg"
                  alt="Bubblify"
                  height={100}
                  width={350}
                  className="h-10 w-auto items-center"
                />
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.reports} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t px-4 py-2">
          <div className="text-muted-foreground mb-2 text-xs font-semibold">
            {role === "DRIVER" ? "DRIVER INFORMATION" : "WORKER INFORMATION"}
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-muted-foreground text-xs">
              Bubblify {user?.role}
            </div>
            <div className="text-muted-foreground text-xs">
              {role === "DRIVER" ? "Driver ID" : "Worker ID"}:{" "}
              {role === "DRIVER"
                ? `DRV${user?.id.toString().padStart(3, "0")}`
                : `WKR${user?.id.toString().padStart(3, "0")}`}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
