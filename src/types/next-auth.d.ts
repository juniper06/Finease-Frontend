import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Extend the User object to include role and token
  interface User {
    id: string;
    email: string;
    role: string;
    token: string;
  }

  // Extend the Session object to include the custom user
  interface Session {
    user: User; // Use the extended User type
  }

  // Extend the JWT object to hold the token and user information
  interface JWT {
    id: string;
    email: string;
    role: string;
    token: string;
  }
}
