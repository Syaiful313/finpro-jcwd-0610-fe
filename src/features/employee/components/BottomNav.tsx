"use client";

import {
  BarChart3,
  DoorClosedLocked,
  History,
  Home,
  ListCheck,
  Package,
  Truck,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";

const BottomNav: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { data: session, status } = useSession();

  const userRole = useMemo(() => session?.user?.role, [session?.user?.role]);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const handleTabClick = useCallback(
    (index: number, href: string) => {
      if (isNavigating || pathname === href) return;

      setIsNavigating(true);
      setActiveIndex(index);

      router.push(href);

      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    },
    [isNavigating, pathname, router],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const navItems = useMemo(() => {
    if (!userRole) return [];

    const isWorker = userRole === "WORKER";

    return [
      {
        id: "/",
        icon: isWorker ? DoorClosedLocked : Truck,
        label: isWorker ? "Bypass" : "Delivery",
        href: isWorker
          ? "/employee/orders/bypass"
          : "/employee/orders/delivery",
      },
      {
        id: "orders",
        icon: isWorker ? ListCheck : Package,
        label: isWorker ? "Orders" : "Pick Up",
        href: isWorker ? "/employee/orders" : "/employee/orders/pick-up",
      },
      {
        id: "home",
        icon: Home,
        label: "Home",
        href: "/employee",
      },
      {
        id: "history",
        icon: History,
        label: "Job History",
        href: "/employee/job-history",
      },
      {
        id: "attendance",
        icon: BarChart3,
        label: "Attendance",
        href: "/employee/attendance",
      },
    ];
  }, [userRole]);

  const currentIndex = useMemo(() => {
    if (navItems.length === 0) return 2;
    const index = navItems.findIndex((item) => pathname === item.href);
    return index >= 0 ? index : 2;
  }, [navItems, pathname]);

  useEffect(() => {
    setMounted(true);
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  if (status === "loading") return null;

  if (!mounted) return null;

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-primary dark:bg-accent absolute inset-0 rounded-t-3xl shadow-lg" />

      <div className="relative px-4 py-5">
        <div className="flex items-center justify-between">
          {navItems.map((item, index) => {
            const itemIsActive = isActive(item.href);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col items-center"
              >
                <button
                  type="button"
                  className={`relative flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-xl transition-transform duration-100 will-change-transform select-none ${
                    itemIsActive
                      ? "scale-110 bg-white text-[#0080FF] shadow-lg dark:bg-[#e5e5e5] dark:text-[#1e3a8a]"
                      : "text-white hover:scale-105 active:scale-95"
                  } ${isNavigating ? "pointer-events-none" : ""}`}
                  onClick={() => handleTabClick(index, item.href)}
                  disabled={isNavigating}
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </button>

                {isHovered && (
                  <span className="pointer-events-none absolute -top-10 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-safe-area-inset-bottom bg-[#0080FF]" />
    </div>
  );
};

export default BottomNav;
