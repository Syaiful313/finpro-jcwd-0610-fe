'use client';

import { FC } from "react";
import { User } from "@/types/user";
import { checkCircleIcon } from "./icon";
import useResendEmailVerif from "@/hooks/api/auth/useResendEmailVerif";
import { Menu } from "lucide-react";

interface HeadSectionProps {
  user: User;
  onOpenSidebar?: () => void; 
}

const HeadSection: FC<HeadSectionProps> = ({ user, onOpenSidebar }) => {
  const { mutate: resendVerification } = useResendEmailVerif();
  const defaultProfileImgUrl = "https://res.cloudinary.com/dd6hqmwqu/image/upload/v1749784682/logo_qmkyh2.svg";

  return (
    <div className="flex items-center justify-center antialiased relative w-full">
      {onOpenSidebar && (
        <button
          onClick={onOpenSidebar}
          className="md:hidden absolute top-4 left-4 z-50 bg-white p-2 rounded shadow"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>
      )}

      <section
        id="top-element"
        className="flex flex-col items-center space-y-6 max-w-xl w-full text-center p-8 transform transition-all duration-300 ease-in-out"
      >
        <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-1.5 shadow-lg">
          <img
            src={user.profilePic || defaultProfileImgUrl}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full border-4 border-white"
          />
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md text-green-500 transform translate-x-1 translate-y-1">
              {checkCircleIcon}
            </div>
          )}
        </div>

        <h1 className="text-4xl font-extrabold text-primary leading-tight tracking-tight gradient-text">
          Welcome, {user.firstName} {user.lastName}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed max-w-md">
          Manage your profile, privacy, and security to optimize how you use our{" "}
          <span className="font-semibold text-primary">laundry services.</span>
        </p>

        {user.isVerified ? (
          <div className="flex items-center bg-green-50 text-green-700 px-5 py-2.5 rounded-full text-base font-medium border border-green-200 cursor-default">
            {checkCircleIcon}
            <span className="ml-2">Account Verified</span>
          </div>
        ) : (
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-7 py-3 rounded-full flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
            onClick={() => resendVerification({ email: user.email })}
          >
            <span className="text-base font-medium">Verify Your Account</span>
          </button>
        )}
      </section>
    </div>
  );
};

export default HeadSection;