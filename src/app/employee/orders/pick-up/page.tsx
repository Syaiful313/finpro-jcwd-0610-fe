import { auth } from "@/lib/auth"; // pastikan path auth benar
import { redirect } from "next/navigation";
import PickUpPage from "@/features/employee/driver/pick-up";
import React from "react";

export default async function PickUp() {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "DRIVER") return redirect("/employee/orders");

  return (
    <div>
      <PickUpPage />
    </div>
  );
}
