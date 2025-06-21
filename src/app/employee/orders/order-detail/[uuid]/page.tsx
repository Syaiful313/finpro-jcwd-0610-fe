import DriverJobDetails from "@/features/employee/order-detail";
import IndexTry from "@/features/employee/order-detail/indexTry";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session?.user.role !== "WORKER" && session?.user.role !== "DRIVER")
    redirect("/");
  return (
    <div>
      {/* <IndexTry /> */}
      <DriverJobDetails />
    </div>
  );
};

export default page;
