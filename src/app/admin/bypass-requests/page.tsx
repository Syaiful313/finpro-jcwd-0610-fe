import BypassPage from "@/features/admin/bypass";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Bypass = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "OUTLET_ADMIN") redirect("/");
  return <BypassPage />;
};

export default Bypass;
