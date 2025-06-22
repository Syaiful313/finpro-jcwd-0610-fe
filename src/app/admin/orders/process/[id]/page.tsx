import OrdersProcessDetailPage from "@/features/admin/orders/process/OrderProcessDetailPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const OrderProcessDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "OUTLET_ADMIN") redirect("/");
  return <OrdersProcessDetailPage orderId={id} />;
};

export default OrderProcessDetail;
