import EmployeePage from "@/features/employee";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Employee = async () => {
  const session = await auth();

  console.log("Session:", session);
  if (!session) return redirect("/login");
  if (session?.user.role !== "WORKER" && session?.user.role !== "DRIVER")
    redirect("/");

  return (
    <div>
      <EmployeePage />
    </div>
  );
};
export default Employee;
