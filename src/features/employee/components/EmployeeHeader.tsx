"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";
import NotificationDropdown from "../notifications/Notifications";

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
      </div>
    </header>
  );
}
