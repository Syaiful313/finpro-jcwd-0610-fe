import { useSession } from "next-auth/react";
import React, { use } from "react";
import DriverOrderList from "../driver/DriverOrderList";
import WorkerOrderList from "../worker/WorkerOrderList";
import { isDriver } from "@/utils/AuthRole";

const Desktop = () => {
  const { data: session } = useSession();
  return (
    <div>{isDriver(session) ? <DriverOrderList /> : <WorkerOrderList />}</div>
  );
};

export default Desktop;
