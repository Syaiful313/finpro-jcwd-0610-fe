'use client'
import Link from "next/link";
import { aboutIcon, addressIcon, ordersIcon, paymentsSubscriptionsIcon, personalInfoIcon } from "./icon";
import { FC } from "react";

interface ProfileSidebarProps {
    activeIndex: any;
    setActiveIndex: any;
}

const ProfileSidebar:FC<ProfileSidebarProps> = ({ activeIndex, setActiveIndex }) => {
  const navbarItems = [
    { name: "Personal info", icon: personalInfoIcon },
    { name: "Addresses", icon: addressIcon },
    { name: "My Orders", icon: ordersIcon },
    { name: "Payments", icon: paymentsSubscriptionsIcon },
    { name: "Notifications", icon: aboutIcon },
  ];

  return (
    <div className="w-80 bg-white p-4 shadow-md overflow-y-auto sticky top-0">
      <Link href='/'>
        <div className="text-xl font-bold mb-6 text-primary">Bubblify Account</div>
      </Link>
      <nav>
        {navbarItems.map((item, index) => (
          <div
            key={item.name}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center p-3 rounded-full cursor-pointer transition-colors duration-200 ${
              index === activeIndex ? 'bg-primary text-muted font-medium' : 'text-gray-700 hover:bg-gray-100'
            } mb-2`}
            role="button"
            tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setActiveIndex(index)}
          >
            <div className="w-5 h-5 mr-3">{item.icon}</div>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;