// "use client";

// import { Badge } from "@/components/ui/badge";
// import { isWorker } from "@/utils/AuthRole";
// import { MapPin, Truck, User } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { FC } from "react";

// interface UserGreetingProps {
//   isMobile: boolean;
// }
// const UserGreeting: FC<UserGreetingProps> = ({ isMobile }) => {
//   const { data } = useSession();
//   const isWorkerRole = isWorker(data);
//   return (
//     <div className={`space-y-2 ${isMobile ? "mt-4" : ""}`}>
//       <h1
//         className={`font-bold text-white ${isMobile ? "text-3xl" : "text-5xl"}`}
//       >
//         Hallo, {data?.user.firstName}!
//       </h1>
//       <div className="flex items-center gap-4">
//         <Badge
//           className={`text-primary bg-white hover:bg-white/90 ${isMobile ? "max-w-20 px-1.5 text-sm" : "text-lg"}`}
//         >
//           {isWorkerRole ? (
//             <User className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
//           ) : (
//             <Truck className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
//           )}
//           {isWorkerRole ? "Worker" : "Driver"}
//         </Badge>
//         <div
//           className={`flex items-center text-white/90 ${
//             isMobile ? "text-md" : "text-lg"
//           }`}
//         >
//           <MapPin className="mr-1 h-4 w-4" />
//           Outlet Yogyakarta
//         </div>
//       </div>
//     </div>
//   );
// };
// export default UserGreeting;
"use client";

import { ModeToggle } from "@/components/ToogleDarkMode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isWorker } from "@/utils/AuthRole";
import { LogOut, MapPin, Truck, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { FC } from "react";

interface UserGreetingProps {
  isMobile: boolean;
  user: any;
  session: any;
}

const UserGreeting: FC<UserGreetingProps> = ({ isMobile, user, session }) => {
  const isWorkerRole = isWorker(session);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className={`space-y-2 ${isMobile ? "mt-4" : ""}`}>
      <h1
        className={`font-bold text-white ${isMobile ? "text-3xl" : "text-5xl"}`}
      >
        Hallo, {user?.firstName}!
      </h1>
      <div className="flex items-center gap-4">
        <div>
          <Badge
            className={`text-primary bg-white hover:bg-white/90 dark:bg-[#1e3a8a] dark:text-white dark:hover:bg-gray-700 ${isMobile ? "max-w-20 px-1.5 text-sm" : "text-lg"}`}
          >
            {isWorkerRole ? (
              <User className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
            ) : (
              <Truck className={`mr-1 ${isMobile ? "h-5 w-8" : "h-3 w-3"}`} />
            )}
            {isWorkerRole ? "Worker" : "Driver"}
          </Badge>
        </div>
        <div
          className={`flex items-center text-white/90 ${
            isMobile ? "text-md" : "text-lg"
          }`}
        >
          <MapPin className="mr-1 h-4 w-4" />
          Outlet Yogyakarta
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className={`w-fit text-white/90 hover:bg-white/10 hover:text-white ${
            isMobile ? "h-6 text-xs" : "h-7 text-sm"
          }`}
        >
          <div className="block items-center gap-2 md:hidden">
            <span className="flex items-center gap-2">
              <LogOut className={`mx-1 ${isMobile ? "h-3 w-3" : "h-3 w-3"}`} />
              Logout
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserGreeting;
