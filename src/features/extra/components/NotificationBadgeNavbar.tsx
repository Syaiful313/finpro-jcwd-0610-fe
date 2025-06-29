import useGetNotificationUser from "@/hooks/api/user/notification/useGetNotificationUser";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react"
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NotificationBadgeNavbarProps {
  session: Session;
}

const NotificationBadgeNavbar = ({ session }: NotificationBadgeNavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();
    const { data: notifications, isLoading } = useGetNotificationUser({ limit: 5 });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) { setIsOpen(false) }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    if (!session) {
        return (
            <div className="relative p-2 rounded-full bg-gray-100 animate-pulse w-9 h-9" />
        );
    }

    const unread = notifications?.some((n) =>!n.readByUserIds.includes(Number(session.user.id)));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
            type="button"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            onClick={handleOpen}
            aria-label="Notifications">
                <Bell className="w-5 h-5 text-muted hover:text-primary" />
                {unread && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}            
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg z-50">
                <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
                <ul className="max-h-64 overflow-auto">
                {isLoading ? (
                    <li className="px-4 py-2 text-sm text-gray-400">Loading...</li>
                ) : notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                    <li
                        key={`${notif.id}-${notif.createdAt}`}
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-b last:border-none"
                    >
                        {notif.message}
                    </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-sm text-gray-400">No notifications</li>
                )}
                </ul>
                <div className="p-2 text-center">
                    <Link href="/user/profile?show=notifications" className="text-blue-600 hover:underline text-sm">
                    View All
                    </Link>
                </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBadgeNavbar