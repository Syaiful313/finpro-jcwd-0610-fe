import SalesReportsPage from "@/features/admin/sales-reports";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SalesReports = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN" && session.user?.role !== "OUTLET_ADMIN")
    redirect("/");

  return <SalesReportsPage />;
};

export default SalesReports;
