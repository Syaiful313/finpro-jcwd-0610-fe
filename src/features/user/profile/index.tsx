'use client'
import useGetUser from "@/hooks/api/user/useGetUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeadSection from "./components/HeadSection";
import { arrowRightIcon } from "./components/icon";
import ProfileSidebar from "./components/ProfileSidebar";
import { EditForm } from "./components/EditForm";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import useForgotPassword from "@/hooks/api/auth/useForgotPassword";

const ProfilePage = () => {
    const [showEditForm, setShowEditForm] = useState(false);
    const session = useSession();
    const router = useRouter();
    const userId = session?.data?.user.id;
    const { data: user, mutate: getUser } = useGetUser(userId!);
    const { mutate: updateUser } = useUpdateUser(userId!);
    const { mutate: forgotPassword } = useForgotPassword();
    const defaultProfileImgUrl = "/logo.svg";

    useEffect(() => {
        if (session.status === "loading") return;
        if (!userId) {
            router.push("/login");
        } else {
            getUser(userId);
        }
    }, [userId]);

    const handleOpenEditForm = () => setShowEditForm(true);

    const handleSave = async (values: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }) => {
        updateUser(values);
    };

    if (session.status === "loading") return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <>
            {showEditForm && (
                <EditForm
                    onClose={() => setShowEditForm(false)}
                    initialFirstName={user.firstName}
                    initialLastName={user.lastName}
                    initialEmail={user.email}
                    initialPhoneNumber={user.phoneNumber}
                    onSave={handleSave}
                />
            )}

            <div className="min-h-screen flex bg-secondary text-gray-800 overflow-hidden">
                {/* Sidebar */}
                <ProfileSidebar />

                {/* Main content */}
                <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto h-screen">
                    <HeadSection user={user} />

                    {/* Basic info */}
                    <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-primary">Basic info</h2>
                            <p className="text-md text-gray-600 mt-1">
                                Some info may be visible to other people using Bubblify service.{" "}
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-600">Profile picture</span>
                                <span className="text-md text-gray-500 mt-1">
                                    A profile picture helps personalise your account
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src={user.profilePic || defaultProfileImgUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* First Name */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <span className="text-gray-600 font-semibold">First Name</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">{user.firstName}</span>
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

                        {/* Last Name */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <span className="text-gray-600 font-semibold">Last Name</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">{user.lastName}</span>
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
                    </div>

                    {/* Contact info & Privacy */}
                    <div className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-primary">Contact info & Privacy</h2>
                        </div>

                        {/* Email */}
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

                        {/* Phone */}
                        <div className="flex items-center justify-between px-6 py-4">
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

                        {/* Password */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <span className="text-gray-600 font-semibold">Password</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">******</span>
                                <div
                                    onClick={() => {forgotPassword({ email: user.email }) }}
                                    className="cursor-pointer"
                                    role="button"
                                >
                                    {arrowRightIcon}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div id="address" className="bg-white rounded-lg shadow-md w-full max-w-4xl mt-8 mb-8">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h2 className="font-semibold text-primary text-xl">Addresses</h2>
                            <p className="text-md text-gray-600 mt-1">
                                Manage addresses associated with your Bubblify Account.{" "}
                            </p>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <span className="text-gray-600 font-semibold">Home</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">Not set</span>
                                {arrowRightIcon}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <span className="text-gray-600 font-semibold">Work</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">Not set</span>
                                {arrowRightIcon}
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4">
                            <span className="text-gray-600 font-semibold">Other</span>
                            <div className="flex items-center">
                                <span className="text-gray-800 mr-2">Other addresses that you added</span>
                                {arrowRightIcon}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage