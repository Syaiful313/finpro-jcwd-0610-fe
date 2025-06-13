import { User } from "@/types/user";
import { checkCircleIcon } from "./icon";
import { FC } from "react";

interface HeadSectionProps {
    user: User
}

const HeadSection:FC<HeadSectionProps> = ({user}) => {
    const defaultProfileImgUrl = "/logo.svg"; // Placeholder for profile pic

    return (
        <section id="top-element" className="flex flex-col items-center space-y-6 max-w-xl text-center mt-8 mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <img src={defaultProfileImgUrl}
                    alt="Profile Picture"
                    className="w-full h-full object-cover rounded-full"/>
            </div>
            <h1 className="text-5xl font-semibold text-primary leading-tight">Welcome, {user.firstName} {user.lastName}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
                Manage your profile, privacy, and security to optimize how you use our laundry services.
            </p>
            {user.isVerified ? (
                <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                {checkCircleIcon}
                <span>Verified Account</span>
            </div>
            ) : (
                <p className="text-lg text-gray-600 leading-relaxed">Please verify your account to enjoy our laundry service.</p> 
            )}
        </section>  
    )
}

export default HeadSection