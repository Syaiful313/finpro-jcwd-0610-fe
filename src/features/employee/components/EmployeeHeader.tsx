"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";
import NotificationDropdown from "./Notifications";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

interface EmployeeHeaderProps {
  breadcrumbs: BreadcrumbItemType[];
}
export function EmployeeHeader({ breadcrumbs }: EmployeeHeaderProps) {
  return (
    <header className="flex h-15 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-15">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-primary text-base font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <BreadcrumbPage className="text-primary text-base font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mr-6 flex gap-3">
        <NotificationDropdown />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 md:gap-3"
            >
              <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium">Worker Laundry</div>
                <div className="text-muted-foreground text-xs">
                  Washing Station
                </div>
              </div>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </header>
  );
}
