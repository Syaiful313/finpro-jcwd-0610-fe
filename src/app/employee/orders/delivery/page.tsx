import DeliveryPage from "@/features/employee/driver/delivery";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Delivery() {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "DRIVER") return redirect("/employee/orders");

  return (
    <div>
      <DeliveryPage />
    </div>
  );
}
