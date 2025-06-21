import AttendanceAdminPage from "@/features/admin/attendance-report";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const AttendanceAdmin = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "OUTLET_ADMIN")
    redirect("/");
  return (
    <div>
      <AttendanceAdminPage />
    </div>
  );
};

export default AttendanceAdmin;
