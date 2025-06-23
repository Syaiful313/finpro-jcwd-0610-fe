import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BypassPage from "@/features/employee/worker/bypass";
import React from "react";

export default async function Bypass() {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "WORKER") return redirect("/employee/orders");

  return (
    <div>
      <BypassPage />
    </div>
  );
}
