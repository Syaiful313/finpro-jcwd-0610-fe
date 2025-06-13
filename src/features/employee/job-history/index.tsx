"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { isDriver } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import DriverHistoryPage from "./components/DriverHistoryPage";
import WorkerHistoryPage from "./components/WorkerHistoryPage";

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

  return (
    <div>
      {isDriver(session) ? <DriverHistoryPage /> : <WorkerHistoryPage />}
    </div>
  );
};

export default JobHistoryPage;
