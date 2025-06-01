"use client";

import { Badge } from "@/components/ui/badge";
import { isWorker } from "@/utils/AuthRole";
import { MapPin, Truck, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface UserGreetingProps {
  isMobile: boolean;
}
const UserGreeting: FC<UserGreetingProps> = ({ isMobile }) => {
  const { data } = useSession();
  const isWorkerRole = isWorker(data);
  return (
    <div className={`space-y-2 ${isMobile ? "mt-4" : ""}`}>
      <h1
        className={`font-bold text-white ${isMobile ? "text-3xl" : "text-5xl"}`}
      >
        Hallo, {data?.user.firstName}!
      </h1>
      <div className="flex items-center gap-4">
        <Badge
          className={`bg-white text-[#0080FF] hover:bg-white/90 ${isMobile ? "max-w-20 px-1.5 text-sm" : "text-lg"}`}
        >
          {isWorkerRole ? (
            <User className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
          ) : (
            <Truck className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
          )}
          {isWorkerRole ? "Worker" : "Driver"}
        </Badge>
        <div
          className={`flex items-center text-white/90 ${
            isMobile ? "text-md" : "text-lg"
          }`}
        >
          <MapPin className="mr-1 h-4 w-4" />
          Outlet Yogyakarta
        </div>
      </div>
    </div>
  );
};
export default UserGreeting;
