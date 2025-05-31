"use client";

import { BarChart3, History, Home, ListCheck, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const BottomNav: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navItems = [
    {
      id: "/",
      icon: User,
      label: "Profile",
      href: "/",
    },
    {
      id: "orders",
      icon: ListCheck,
      label: "Orders",
      href: "/employee/orders",
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

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  useEffect(() => {
    setMounted(true);
    const currentIndex = navItems.findIndex((item) => pathname === item.href);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 2);
  }, [pathname]);

  // Optimized click handler with useRouter
  const handleTabClick = useCallback(
    (index: number, href: string) => {
      if (isNavigating || pathname === href) return; // Prevent multiple clicks or same page

      setIsNavigating(true);
      setActiveIndex(index);

      // Use router.push for client-side navigation
      router.push(href);

      // Reset navigation state after a short delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    },
    [isNavigating, pathname, router],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!mounted) return null;

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Blue background */}
      <div className="absolute inset-0 rounded-t-3xl bg-[#0080FF] shadow-lg" />

      {/* Navigation content */}
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
                      ? "scale-110 bg-white text-[#0080FF] shadow-lg"
                      : "text-white hover:scale-105 active:scale-95"
                  } ${isNavigating ? "pointer-events-none" : ""}`}
                  onClick={() => handleTabClick(index, item.href)}
                  disabled={isNavigating}
                  aria-label={item.label}
                >
                  <item.icon className="h-6 w-6" />
                </button>

                {/* Show label on hover */}
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

      {/* Bottom safe area */}
      <div className="h-safe-area-inset-bottom bg-[#0080FF]" />
    </div>
  );
};

export default BottomNav;
