import { Session } from "next-auth";

export const isAdmin = (session: Session | null) => {
  return session?.user.role === "ADMIN";
};

export const isWorker = (session: Session | null) => {
  return session?.user?.role === "WORKER";
};
export const isDriver = (session: Session | null) => {
  return session?.user?.role === "DRIVER";
};
export const isOutletAdmin = (session: Session | null) => {
  return session?.user?.role === "OUTLET_ADMIN";
};
