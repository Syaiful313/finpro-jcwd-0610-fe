import { User } from "./user";

interface Payload extends User {
  accessToken: string;
}

declare module "next-auth" {
  interface Session {
    user: Payload;
  }
}