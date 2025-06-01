"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import Desktop from "./components/Desktop";
import Mobile from "./components/Mobile";
import { useRouter } from "next/navigation";

const JobHistoryPage = () => {
  const { data: session, status } = useSession();
  const { setBreadcrumbs } = useBreadcrumb();
  const router = useRouter();
  const isMobile: boolean = useMediaQuery("(max-width: 767px)");
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Job History" },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);
  return isMobile ? <Mobile /> : <Desktop />;
};

export default JobHistoryPage;
