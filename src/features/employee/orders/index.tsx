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
  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/employee" },
      { label: "Orders" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div>{isDriver(session) ? <DriverOrderList /> : <WorkerOrderList />}</div>
  );
};

export default OrderPage;
