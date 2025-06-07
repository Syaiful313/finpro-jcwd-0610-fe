import { isDriver } from "@/utils/AuthRole";
import { useSession } from "next-auth/react";
import React from "react";
import DriverOrderList from "../driver/DriverOrderList";
import WorkerOrderList from "../worker/WorkerOrderList";

const Mobile = () => {
  const { data: session } = useSession();
  return (
    <div>{isDriver(session) ? <DriverOrderList /> : <WorkerOrderList />}</div>
  );
};

export default Mobile;
