import UsersPage from "@/features/admin/users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Users = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "OUTLET_ADMIN")
    redirect("/");

  return <UsersPage />;
};

export default Users;
