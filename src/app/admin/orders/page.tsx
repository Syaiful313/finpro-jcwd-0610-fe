import OrdersPage from "@/features/admin/orders";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Orders = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN" && session.user?.role !== "OUTLET_ADMIN")
    redirect("/");
  
  return <OrdersPage />;
};

export default Orders;
