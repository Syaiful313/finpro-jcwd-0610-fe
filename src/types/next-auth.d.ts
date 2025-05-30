import { User } from "./user";

interface Payload extends User {
  accessToken: string;
  outletId?: number;
}

declare module "next-auth" {
  interface Session {
    user: Payload;
  }
}
