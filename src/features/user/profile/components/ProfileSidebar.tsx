'use client'
import Link from "next/link";
import { aboutIcon, addressIcon, ordersIcon, paymentsSubscriptionsIcon, personalInfoIcon } from "./icon";
import { useState } from "react";

const ProfileSidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navbarItems = [
        { name: "Personal info", icon: personalInfoIcon, href: "/user/profile#top-element"},
        { name: "Addresses", icon: addressIcon, href: "/user/profile#address"},
        { name: "My Orders", icon: ordersIcon, href: "#"},
        { name: "Payments", icon: paymentsSubscriptionsIcon, href: "#"},
        { name: "Notifications", icon: aboutIcon, href: "#"},
    ];

    return (
        <div className="w-80 bg-white p-4 shadow-md overflow-y-auto sticky top-0">
            <Link href='/'>
                <div className="text-xl font-bold mb-6 text-primary">Bubblify Account</div>
            </Link>
            <nav>
                {navbarItems.map((item, index) => (
                    <Link key={item.name} href={item.href} onClick={() => {setActiveIndex(index)}}>
                        <div className={`flex items-center p-3 rounded-full cursor-pointer transition-colors duration-200 ${
                            index === activeIndex ? 'bg-primary text-muted font-medium' : 'text-gray-700 hover:bg-gray-100'
                            } mb-2`}>
                            <div className="w-5 h-5 mr-3">{item.icon}</div>
                            <span>{item.name}</span>
                        </div>
                    </Link> 
                ))}
            </nav>
        </div>
    )
}

export default ProfileSidebar;