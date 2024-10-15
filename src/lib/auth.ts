import NextAuth, { AuthError, Session, User } from "next-auth";
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
        const { email, password } = credentials;
        const res = await fetch(`${process.env.SERVER_API}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        const result = await res.json();
        if (res.ok && result.jwt) {
          console.log("JWT received: ", result.jwt);
          return {
            id: result.userId,
            email: result.email,
            role: result.role,
            token: result.jwt,
          };
        }
        throw new AuthError("Invalid Credential");
      },
    }),
  ],
  callbacks: {
    jwt: async ({ trigger, token, session, user }) => {
      if (trigger === "update" && session) {
        return { ...token, user: session.user };
      }
      if (user) {
        return {
          ...token,
          user,
        };
      }
      return token;
    },
    session: async ({ trigger, newSession, session, token }) => {
      if (trigger === "update" && newSession) {
        return { ...session, ...newSession };
      }
      if (token) {
        return {
          ...session,
          ...token,
        };
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
