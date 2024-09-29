import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
  interface User {
    role: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${process.env.SERVER_API}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        const result = await res.json();
        if (res.status === 200) {
          return {
            ...result.data,
            role: result.data.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          user,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/",
  },
  logger: {
    error(code, ...message) {
      if (code.name !== "CredentialsSignin") {
        console.error(code, message);
      }
    },
  },
});
