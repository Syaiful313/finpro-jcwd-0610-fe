"use client";
import React, { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Mobile from "./components/Mobile";
import Desktop from "./components/Desktop";

const OrderPage = () => {
  const { data: session, status } = useSession();
  const { setBreadcrumbs } = useBreadcrumb();
  const router = useRouter();
  const isMobile: boolean = useMediaQuery("(max-width: 767px)");
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);
  return isMobile ? <Mobile /> : <Desktop />;
};

export default OrderPage;
