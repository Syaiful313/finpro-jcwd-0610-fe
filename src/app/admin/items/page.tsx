import ItemsPage from "@/features/admin/items";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Items = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");
  return <ItemsPage />;
};

export default Items;
