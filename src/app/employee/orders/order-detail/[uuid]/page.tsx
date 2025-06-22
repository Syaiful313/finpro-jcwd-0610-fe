import DriverJobDetails from "@/features/employee/order-detail";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session?.user.role !== "WORKER" && session?.user.role !== "DRIVER")
    redirect("/");
  return (
    <div>
      <DriverJobDetails />
    </div>
  );
};

export default page;
