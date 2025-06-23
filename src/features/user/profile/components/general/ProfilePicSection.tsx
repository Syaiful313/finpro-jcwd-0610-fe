import useUploadProfilePic from "@/hooks/api/user/useUploadProfilePic";
import { User } from "@/types/user"
import { FC, useRef } from "react"

interface ProfilePicSectionProps {
    user: User
}
const ProfilePicSection:FC<ProfilePicSectionProps> = ({ user }) => {
    const triggerFileInput = () => { fileInputRef.current?.click() };
    const isValidProfilePic = user?.profilePic && user.profilePic !== 'null' && user.profilePic !== 'undefined';
    const defaultProfileImgUrl = `https://ui-avatars.com/api/?name=${user?.firstName}&background=DDDDDD&color=555555&bold=true&rounded=true`;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("profilePic", file);
        uploadProfilePic(formData);
    };
    const { mutate: uploadProfilePic } = useUploadProfilePic(user.id!);

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex flex-col">
            <span className="font-semibold text-gray-600">Profile picture</span>
            <span className="hidden md:flex text-md text-gray-500 mt-1">A profile picture helps personalise your account</span>
        </div>
        <div onClick={user?.provider === "GOOGLE" ? () => {} : triggerFileInput}
            className={`relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 group ${
                user?.provider === "GOOGLE" ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
        >
            <img className="w-full h-full object-cover"
                src={isValidProfilePic ? user.profilePic : defaultProfileImgUrl}
                alt="Profile"
            />
            <input className="hidden"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs">Edit</span>
            </div>
        </div>
    </div>
  )
}

export default ProfilePicSection