import DashboardPage from "@/features/admin/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "OUTLET_ADMIN")
    redirect("/");
  
  return <DashboardPage />;
};

export default Dashboard;
