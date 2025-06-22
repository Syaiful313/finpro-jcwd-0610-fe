"use client";
import OrderPage from "@/features/employee/orders";

const Orders = () => {
  // const session = await auth();

  // if (!session) return redirect("/login");
  // if (session?.user.role !== "DRIVER") redirect("/");
  return (
    <div>
      <OrderPage />
    </div>
  );
};

export default Orders;
