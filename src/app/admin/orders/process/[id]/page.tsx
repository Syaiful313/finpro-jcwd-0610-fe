import OrdersDetailPage from "@/features/admin/orders/process/OrderDetailPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const OrderDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "OUTLET_ADMIN") redirect("/");
  return <OrdersDetailPage orderId={id} />;
};

export default OrderDetail;
