import { log } from "console";
import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      token: string;
    };
  }
  interface User {
    role: string;
    token: string;
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
        const res = await fetch(`${process.env.SERVER_API}/users/login`, {
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
        if (res.ok && result.jwt) {
          console.log("JWT received: ", result.jwt);
          return {
            id: result.userId,
            email: credentials.email,
            role: result.role,
            token: result.jwt,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        console.log("User in JWT callback:", user);
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
        token: token.token, // Pass the token to the frontend
      };
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
