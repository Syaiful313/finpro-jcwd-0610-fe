import Link from "next/link";
import { FC } from "react";

interface MenuListProps {
  className?: string;
  onNavigate?: () => void;
};

const menuItems = [
  { name: 'Services', href: '/services' },
  { name: 'Locations', href: '/locations' },
  { name: 'Pricing', href: '/services#pricing' },
  { name: 'About', href: '/about' },
]


export const MenuList:FC<MenuListProps> = ({ className, onNavigate }) => (
  <ul className={className}>
    {menuItems.map((item, index) => (
      <li key={index}>
        <Link
          href={item.href}
          className="hover:text-white block duration-150 text-primary"
          onClick={() => { if (onNavigate) onNavigate(); }}>
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
)