import OrderDetailPage from "@/features/admin/orders/OrderDetailPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const OrderDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN" && session.user?.role !== "OUTLET_ADMIN")
    redirect("/");
  return <OrderDetailPage orderId={id} />;
};

export default OrderDetail;
