"use client";

import {
  BarChartIcon,
  CameraIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { NavDocuments } from "./NavDocument";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"], // dapat diakses oleh admin dan user
    },
    {
      title: "Management User",
      url: "/admin/users",
      icon: UsersIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"], // hanya admin
    },
    {
      title: "Management Outlet",
      url: "/admin/outlets",
      icon: StoreIcon,
      roles: ["ADMIN"], // hanya admin
    },
    {
      title: "Item Laundry",
      url: "/admin/items",
      icon: PackageIcon,
      roles: ["ADMIN"], // hanya admin
    },
    {
      title: "Order Laundry",
      url: "/admin/orders",
      icon: ShoppingCartIcon,
      roles: ["ADMIN", "user"], // dapat diakses oleh admin dan user
    },
    {
      title: "Bypass Request",
      url: "/admin/bypass-requests",
      icon: SettingsIcon,
      roles: ["ADMIN"], // hanya admin
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
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
  documents: [
    {
      name: "Laporan Pendapatan",
      url: "#",
      icon: DatabaseIcon,
      roles: ["ADMIN"], // hanya admin yang bisa lihat laporan
    },
    {
      name: "Laporan Performa",
      url: "#",
      icon: BarChartIcon,
      roles: ["ADMIN"], // hanya admin yang bisa lihat laporan
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  // Filter navigasi berdasarkan role user
  const getFilteredNavItems = (items: any[]) => {
    if (!session?.user?.role) return [];

    return items.filter((item) => {
      if (!item.roles) return true; // jika tidak ada roles, tampilkan untuk semua
      return item.roles.includes(session.user.role);
    });
  };

  // Loading state saat session masih dimuat
  if (status === "loading") {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!h-auto data-[slot=sidebar-menu-button]:!p-2"
              >
                <Link href="/" className="flex w-full items-center">
                  <Image
                    src="/logo-text.svg"
                    alt="Bubblify Logo"
                    width={180}
                    height={45}
                    className="h-11 w-auto max-w-full"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="text-muted-foreground p-4 text-center text-sm">
            Loading...
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Jika tidak ada session, jangan tampilkan navigasi sensitif
  if (!session) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!h-auto data-[slot=sidebar-menu-button]:!p-2"
              >
                <Link href="/" className="flex w-full items-center">
                  <Image
                    src="/logo-text.svg"
                    alt="Bubblify Logo"
                    width={180}
                    height={45}
                    className="h-11 w-auto max-w-full"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
      </Sidebar>
    );
  }

  const filteredNavMain = getFilteredNavItems(data.navMain);
  const filteredDocuments = getFilteredNavItems(data.documents);

  // Menyesuaikan format user untuk NavUser component
  const userForNavUser = {
    name: session.user?.firstName || "User",
    email: session.user?.email || "user@example.com",
    avatar: session.user?.profilePic || "/avatars/default.jpg",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!h-auto data-[slot=sidebar-menu-button]:!p-2"
            >
              <Link href="/" className="flex w-full items-center">
                <Image
                  src="/logo-text.svg"
                  alt="Bubblify Logo"
                  width={180}
                  height={45}
                  className="h-11 w-auto max-w-full"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {filteredDocuments.length > 0 && (
          <NavDocuments items={filteredDocuments} />
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userForNavUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
