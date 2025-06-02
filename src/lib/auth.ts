import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(user) {
        if (user) return user;
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
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
    async signIn() {
      return true;
    },
    async jwt({ token, user, account }) {
      // console.log("=== JWT CALLBACK DEBUG ===");
      // console.log("Account provider:", account?.provider);
      // console.log("User data:", user);
      // console.log("Token before:", token);
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;

        if (account?.provider === "github" || account?.provider === "google") {
          token.role = "USER";
        } else if (account?.provider === "credentials") {
          token.role = (user as any).role;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },

    // async jwt({ token, user }) {
    //     if (user) token.user = user;
    //     return token;
    // },
    // async session({ session, token }: any) {
    //     if (token.user) session.user = token.user;
    //     return session;
    // },
  },
});
