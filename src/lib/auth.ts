import {
  NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
} from "@/config";
import { axiosInstance } from "@/lib/axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(user) {
        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const response = await axiosInstance.post("/auth/google", {
            tokenId: account.id_token,
          });

          if (response.data) {
            profile!.backendData = response.data;
            return true;
          }
        } catch (error) {
          console.error("Google login failed:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        if (profile?.backendData) {
          token.backendData = profile.backendData;
        }
      }
      if (user) token.user = user;
      return token;
    },

    async session({ session, token }: any) {
      if (token?.backendData) {
        const { accessToken, ...userData } = token.backendData;
        session.user = userData;
        session.backendToken = accessToken;
      } else if (token?.user?.accessToken) {
        const { accessToken, ...userData } = token.user;
        session.user = userData;
        session.backendToken = accessToken;
      } else if (token?.user) {
        session.user = token.user;
      }

      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/user/profile`;
      }

      if (url.startsWith("/")) return `${baseUrl}${url}`;

      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },
  debug: true,
});
