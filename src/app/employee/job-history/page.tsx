import JobHistoryPage from "@/features/employee/job-history";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const JobHistory = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session?.user.role !== "WORKER" && session?.user.role !== "DRIVER")
    redirect("/");
  return (
    <div>
      <JobHistoryPage />
    </div>
  );
};

export default JobHistory;
