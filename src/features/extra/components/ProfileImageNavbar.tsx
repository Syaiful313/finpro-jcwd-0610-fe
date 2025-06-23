import Link from "next/link";

export const ProfileImage = ({ user }: { user: any }) => {
  const isValidProfilePic =
    user.profilePic &&
    user.profilePic !== 'null' &&
    user.profilePic !== 'undefined';
  const fallbackProfileImg = `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=DDDDDD&color=555555&bold=true&rounded=true`;

  return (
    <Link href="/user/profile">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <img
          src={isValidProfilePic ? user.profilePic : fallbackProfileImg}
          alt="Profile Picture"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackProfileImg;
          }}
        />
      </div>
    </Link>
  );
};