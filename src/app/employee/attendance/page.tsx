import AttendancePage from "@/features/employee/attendance";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Attendance = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session?.user.role !== "WORKER" && session?.user.role !== "DRIVER")
    redirect("/");

  return (
    <div>
      <AttendancePage />
    </div>
  );
};

export default Attendance;
