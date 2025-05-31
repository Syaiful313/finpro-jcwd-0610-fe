"use client";

import {
  BarChartIcon,
  CalendarCheckIcon,
  ClockIcon,
  DatabaseIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOut,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
  WashingMachine,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavDocuments } from "./NavDocument";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Role types
type Role = "DRIVER" | "WORKER";

interface EmployeeSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: Role;
}

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
        url: "#",
        icon: HelpCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: SearchIcon,
      },
    ],
  };

  if (role === "DRIVER") {
    return {
      ...baseData,
      navMain: [
        {
          title: "Home",
          url: "/employee",
          icon: HomeIcon,
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

export function EmployeeSidebar({ role, ...props }: EmployeeSidebarProps) {
  const data = getNavDataByRole(role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="items-center pl-4">
              <Image
                src="/bub-logo.svg"
                alt="Bubblify"
                height={100}
                width={350}
                className="h-10 w-auto items-center"
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.reports} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        {/* <NavUser user={data.user} />*/}
        <div className="mt-6 border-t px-4 py-4">
          <div className="text-muted-foreground mb-2 text-xs font-semibold">
            WORKER INFORMATION
          </div>
          <div className="mb-4">
            <div className="text-sm font-medium">Jennie Kim</div>
            <div className="text-muted-foreground text-xs">Laundry Worker</div>
            <div className="text-muted-foreground text-xs">
              Worker ID: WKR001
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
