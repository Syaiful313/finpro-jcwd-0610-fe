"use client";

import {
  BarChartIcon,
  CalendarCheckIcon,
  ClockIcon,
  DatabaseIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  ListIcon,
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
    documents: [
      {
        name: "Income Report",
        url: "#",
        icon: DatabaseIcon,
      },
      {
        name: "Performance Report",
        url: "#",
        icon: BarChartIcon,
      },
    ],
  };

  if (role === "DRIVER") {
    return {
      ...baseData,
      navMain: [
        {
          title: "Home",
          url: "/dashboard",
          icon: HomeIcon,
        },
        {
          title: "Order List",
          url: "/dashboard/orders",
          icon: ListIcon,
        },
        {
          title: "Pick Up",
          url: "/dashboard/orders/pick-up",
          icon: PackageIcon,
        },
        {
          title: "Delivery",
          url: "/dashboard/orders/delivery",
          icon: TruckIcon,
        },
        {
          title: "Job History",
          url: "/dashboard/job-history",
          icon: ClockIcon,
        },
        {
          title: "Attendance",
          url: "/dashboard/attendance-history",
          icon: CalendarCheckIcon,
        },
      ],
    };
  } else {
    // WORKER
    return {
      ...baseData,
      navMain: [
        {
          title: "Home",
          url: "/dashboard",
          icon: HomeIcon,
        },
        {
          title: "Order List",
          url: "/dashboard/orders",
          icon: ListIcon,
        },
        {
          title: "Queue",
          url: "/dashboard/orders/queue",
          icon: UsersIcon,
        },
        {
          title: "Bypass Request",
          url: "/dashboard/orders/bypass",
          icon: FileTextIcon,
        },
        {
          title: "Job History",
          url: "/dashboard/job-history",
          icon: ClockIcon,
        },
        {
          title: "Attendance",
          url: "/dashboard/attendance-history",
          icon: CalendarCheckIcon,
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
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <WashingMachine className="text-primary-foreground h-4 w-4" />
                </div>
                <span className="text-xl font-semibold">Bubblify</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
