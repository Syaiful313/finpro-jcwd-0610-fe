'use client'
import { ShoppingCart, Home, Package, Wallet, Bell, LogOut, Search } from "lucide-react";
import { FC } from "react";
import { signOut,  } from 'next-auth/react'
import Image from "next/image";
import Link from "next/link";

interface ProfileSidebarProps {
    activeIndex: any;
    setActiveIndex: any;
}

const ProfileSidebar:FC<ProfileSidebarProps> = ({ activeIndex, setActiveIndex }) => {
  const navbarItems = [
    { name: "Personal info", icon: Home },
    { name: "Addresses", icon: Package },
    { name: "Order", icon: ShoppingCart },
    { name: "Payments", icon: Wallet },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white p-6 shadow-lg rounded-r-xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center mb-10 pl-2">
            <Link href="/" className="flex w-full items-center">
              <Image
                src="/logo-text.svg"
                alt="Bubblify Logo"
                width={180}
                height={45}
                className="h-11 w-auto max-w-full"
              />
            </Link>
          </div>

          <nav>
            <ul>
              {navbarItems.map((item, index) => (
                <li key={item.name} 
                className="mb-2"
                onClick={() => setActiveIndex(index)}>
                  <div
                    className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200 
                      ${index === activeIndex ? 'bg-primary text-muted font-medium' : 'text-gray-700 hover:bg-gray-100'}`} 
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-auto">
          <ul className="pt-4 border-t border-gray-200">
            <li>
              <button
                className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default ProfileSidebar;