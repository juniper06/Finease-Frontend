import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoute,
} from "@/lib/routes";

type UserRole = 'CFO' | 'CEO' | 'ADMIN' | 'GUEST';

interface CustomSession {
  user: {
    role: UserRole;
  };
}

const roleProtectedRoutes: Record<UserRole, string[]> = {
  CFO: ["/", "/customers", "/invoices", "/items", "/payments-received", "/expenses-tracking"],
  CEO: ["/ceo", "/ceo/forecasting", "/ceo/startup"],
  ADMIN: ["/admin"],
  GUEST: ["/guest"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth as CustomSession | null;
  const userRole = user?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoute.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Allow access to the login page without redirection
  if (nextUrl.pathname === '/login') {
    return;
  }

  // Redirect to login page if not logged in, excluding public routes
  if (!isLoggedIn && !isPublicRoute) {
    const redirectUrl = new URL("/login", nextUrl);
    const callbackUrl = nextUrl.pathname;
    redirectUrl.searchParams.append("callbackUrl", callbackUrl);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoggedIn && userRole) {
    const userRolePaths = roleProtectedRoutes[userRole] || [];
    if (!userRolePaths.some(path => nextUrl.pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};