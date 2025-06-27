"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChartIcon,
  DatabaseIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import { NavDocuments } from "./NavDocument";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { ModeToggle } from "@/components/ToogleDarkMode";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dasbor",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"],
    },
    {
      title: "Kelola Pengguna",
      url: "/admin/users",
      icon: UsersIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"],
    },
    {
      title: "Kelola Outlet",
      url: "/admin/outlets",
      icon: StoreIcon,
      roles: ["ADMIN"],
    },
    {
      title: "Item Laundry",
      url: "/admin/items",
      icon: PackageIcon,
      roles: ["ADMIN"],
    },
    {
      title: "Pesanan Laundry",
      url: "/admin/orders",
      icon: ShoppingCartIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"],
    },
    {
      title: "Permintaan Bypass",
      url: "/admin/bypass-requests",
      icon: SettingsIcon,
      roles: ["OUTLET_ADMIN"],
    },
  ],
  navSecondary: [
    {
      title: "Pengaturan",
      url: "/user/profile",
      icon: SettingsIcon,
    },
    {
      title: "Bantuan",
      url: "mailto:bubbilfyofficial@gmail.com",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Laporan Pendapatan",
      url: "/admin/sales-reports",
      icon: DatabaseIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"],
    },
    {
      name: "Laporan Kinerja",
      url: "/admin/employee-performances",
      icon: BarChartIcon,
      roles: ["ADMIN", "OUTLET_ADMIN"],
    },
    {
      name: "Laporan Kehadiran",
      url: "/admin/attendance-report",
      icon: SettingsIcon,
      roles: ["OUTLET_ADMIN"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user;

  const getFilteredNavItems = (items: any[]) => {
    if (!session?.user?.role) return [];

    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(session.user.role);
    });
  };

  const logout = () => {
    signOut({
      redirectTo: "/",
    });
  };

  const filteredNavMain = getFilteredNavItems(data.navMain);
  const filteredDocuments = getFilteredNavItems(data.documents);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center px-3">
              <Image
                src="/bub-logo.svg"
                alt="Bubblify"
                height={100}
                width={350}
                className="h-10 w-auto items-center"
              />
              <ModeToggle />
            </div>
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
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="bg-card w-full rounded-lg border-t p-3">
              <div className="mb-3 grid grid-cols-[auto_1fr] items-center gap-3">
                <Avatar className="h-10 w-10 rounded-lg grayscale">
                  <AvatarImage src={user?.profilePic} alt={user?.lastName} />
                  <AvatarFallback className="rounded-lg">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-border/80 w-full justify-center transition-all duration-200"
              >
                <LogOutIcon className="mr-2 h-4 w-4 opacity-60" />
                <span className="text-sm">Keluar</span>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
