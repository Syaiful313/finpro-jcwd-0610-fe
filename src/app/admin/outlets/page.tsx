import OutletsPage from "@/features/admin/outlets";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Outlets = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user?.role !== "ADMIN") redirect("/");

  return <OutletsPage />;
};

export default Outlets;
