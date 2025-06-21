import useGetNotificationUser from "@/hooks/api/user/notification/useGetNotificationUser";
import { cn } from "@/lib/utils"; 
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Loading from "../Loading";
import { useEffect, useState } from "react";
import useMarkAllNotif from "@/hooks/api/user/notification/useMarkNotification";
import { Notification } from "@/types/notification";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

const PAGE_SIZE = 5;

const NotifListSection = () => {
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const { data: session } = useSession();
    const { data: notifications, isLoading, isFetching } = useGetNotificationUser({ page, limit: PAGE_SIZE });
    const { mutate: markAllAsRead, isPending: isMarking } = useMarkAllNotif();
    const userId = session?.user?.id;

    useEffect(() => {
        if (notifications && page === 1) {
            setAllNotifications(notifications);
        } else if (notifications && page > 1) {
            setAllNotifications((prev) => [...prev, ...notifications]);
        }
    }, [notifications, page]);

    const hasMore = notifications?.length === PAGE_SIZE;

  return (
    // <div className="p-4 max-h-80 overflow-auto">
    //   {isLoading ? (
    //     <div className="flex justify-center items-center py-10">
    //         <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    //     </div>
    //   ) : notifications && notifications.length > 0 ? (
    //     <ul>
    //       {notifications.map((notif) => (
    //         <li
    //           key={notif.id}
    //           className={cn(
    //             "px-4 py-2 text-sm border-b last:border-none",
    //             !notif.isRead ? "bg-gray-100 font-medium" : "text-gray-700"
    //           )}
    //         >
    //           <div>{notif.message}</div>
    //           <div className="text-xs text-gray-400 mt-1">
    //             {dayjs(notif.createdAt).fromNow()}
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <div className="text-sm text-gray-400 px-2 py-1">No notifications</div>
    //   )}
    // </div>

    <div className="p-4 max-h-[32rem] overflow-auto space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
            onClick={() => markAllAsRead()}
            disabled={isMarking}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
            Mark all as read
            </button>
        </div>

        {isLoading && page === 1 ? (
            <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        ) : allNotifications.length > 0 ? (
            <>
            <ul className="space-y-2">
                {allNotifications.map((notif) => {
                    const isRead = notif.readByUserIds.includes(Number(userId));
                    return (
                    <li
                        key={notif.id}
                        className={cn(
                        "relative rounded-lg px-4 py-3 shadow-sm border bg-white hover:bg-gray-50 transition-all",
                        !isRead ? "border-blue-500" : "border-gray-200"
                        )}
                    >
                        {!isRead && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <div className="text-sm text-gray-800">{notif.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                        {dayjs(notif.createdAt).fromNow()}
                        </div>
                    </li>
                    );
                })}
            </ul>

            {hasMore && (
                <div className="flex justify-center mt-4">
                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isFetching}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                    {isFetching ? "Loading..." : "Load more"}
                </button>
                </div>
            )}
            </>
        ) : (
            <div className="text-sm text-gray-400">No notifications</div>
        )}
    </div>

  );
};

export default NotifListSection;
