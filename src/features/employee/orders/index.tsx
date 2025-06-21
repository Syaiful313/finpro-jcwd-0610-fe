"use client";
import { isDriver } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumb } from "../components/BreadCrumbContext";
import DriverOrderList from "./driver/DriverOrderList";
import WorkerOrderList from "./worker/WorkerOrderList";

const OrderPage = () => {
  const { data: session, status } = useSession();
  const { setBreadcrumbs } = useBreadcrumb();
  const router = useRouter();
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders" },
    ]);
  }, [setBreadcrumbs]);

  if (status === "unauthenticated") {
    router.push("/");
  }
  return (
    <div>{isDriver(session) ? <DriverOrderList /> : <WorkerOrderList />}</div>
  );
};

export default OrderPage;
