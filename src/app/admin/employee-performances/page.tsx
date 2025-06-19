import EmployeePerformancePage from "@/features/admin/employee-performance";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const EmployeePerformance = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN" && session.user?.role !== "OUTLET_ADMIN")
    redirect("/");
  
  return <EmployeePerformancePage />;
};

export default EmployeePerformance;
