import { FC } from 'react';
import { User } from "@/types/user"; 
import { arrowRightIcon } from "../icon"; 

interface ProfileContactInfoProps {
    user: User;
    handleOpenEditForm: () => void;
    forgotPassword: (payload: { email: string }) => void;
}

const PersonalInfo: FC<ProfileContactInfoProps> = ({
    user,
    handleOpenEditForm,
    forgotPassword,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8">
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-primary">Contact info & Privacy</h2>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <span className="text-gray-600 font-semibold">Email</span>
                <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user.email}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <span className="text-gray-600 font-semibold">Phone</span>
                <div className="flex items-center">
                    <span className="text-gray-800 mr-2">{user.phoneNumber}</span>
                    <div
                        onClick={handleOpenEditForm}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleOpenEditForm()}
                    >
                        {arrowRightIcon}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <span className="text-gray-600 font-semibold">Password</span>
                <div className="flex items-center">
                    <span className="text-gray-800 mr-2">******</span>
                    <div
                        onClick={() => { forgotPassword({ email: user.email }) }}
                        className="cursor-pointer"
                        role="button"
                    >
                        {arrowRightIcon}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;