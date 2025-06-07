"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  Package,
  CreditCard,
  Camera,
  Play,
  CheckCircle,
  MessageCircle,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DesktopLayout from "./components/Desktop";
import MobileLayout from "./components/Mobile";

// Mock data
const jobData = {
  orderNumber: "#slibaww00900",
  jobType: "DELIVERY" as "PICKUP" | "DELIVERY",
  driverStatus: "ASSIGNED" as
    | "PENDING"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED",
  customer: {
    name: "Albus Dumbledore",
    phone: "08123456788",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 4.8,
  },
  pickup: {
    address: "775 Rolling Green Rd.",
    time: "2:00 PM",
  },
  dropoff: {
    address: "2464 Royal Ln. Mesa",
    time: "4:30 PM",
  },
  load: {
    weight: "2.5 Kg",
    items: "12 clothing items",
  },
  payment: {
    status: "PAID" as "PAID" | "WAITING_PAYMENT",
    total: 75000,
    method: "Digital Wallet",
  },
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

export default function DriverJobDetail() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
