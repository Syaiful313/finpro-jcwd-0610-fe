"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    exact?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            let isActive = false;

            if (item.url === "/employee") {
              isActive = pathname === "/employee";
            } else if (item.exact) {
              isActive = pathname === item.url;
            } else if (item.url === "/employee/orders") {
              isActive = pathname === "/employee/orders";
            } else {
              isActive =
                pathname === item.url || pathname.startsWith(item.url + "/");
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => router.push(item.url)}
                  className={cn(
                    "hover:bg-accent w-full cursor-pointer justify-start transition-colors",
                    isActive &&
                      "bg-primary dark:bg-sidebar-accent font-semibold text-white",
                  )}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
