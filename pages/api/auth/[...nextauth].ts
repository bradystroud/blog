import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const allowedUsers = (process.env.DRAFTS_ALLOWED_GITHUB_USERS ?? "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (allowedUsers.length === 0) return true;
      const login = (profile as { login?: string })?.login?.toLowerCase() ?? "";
      return allowedUsers.includes(login);
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.username = (profile as { login?: string }).login;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
