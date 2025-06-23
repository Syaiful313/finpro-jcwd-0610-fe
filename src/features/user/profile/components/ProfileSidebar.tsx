'use client'
import { ShoppingCart, Home, Package, Bell, LogOut, X, Menu } from "lucide-react";
import { FC, useState } from "react";
import { signOut } from 'next-auth/react'
import Image from "next/image";
import Link from "next/link";

interface ProfileSidebarProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const ProfileSidebar: FC<ProfileSidebarProps> = ({ activeIndex, setActiveIndex }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navbarItems = [
    { name: "Personal info", icon: Home },
    { name: "Addresses", icon: Package },
    { name: "Order", icon: ShoppingCart },
    { name: "Notifications", icon: Bell },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden p-4 z-50 fixed top-4 left-4"
      >
        <Menu className="w-6 h-6" />
      </button>
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg rounded-r-xl z-40 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col justify-between overflow-y-auto`}
      >
        <div className="md:hidden flex justify-end mb-12">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
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
                <li key={item.name} className="mb-2" onClick={() => {
                  setActiveIndex(index);
                  setIsSidebarOpen(false); 
                }}>
                  <div className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200 
                    ${index === activeIndex ? 'bg-primary text-white font-medium' : ''}`}>
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <ul className="md:hidden pt-4 border-t border-gray-200">
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
          </nav>
        </div>

        <div className="mt-auto">
          <ul className="pt-4 border-t border-gray-200">
            <li>
              <button
                className="hidden md:flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors duration-200"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileSidebar;