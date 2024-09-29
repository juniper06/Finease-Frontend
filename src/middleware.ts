import { auth } from "@/lib/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoute,
} from "@/lib/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface CustomSession {
  user: {
    role: string;
  };
}

const roleProtectedRoutes = {
  CFO: ["/", "/customers", "/invoices", "/items", "/payments-received", "/expenses-tracking"],
  CEO: ["/ceo", "/ceo/forecasting", "/ceo/startup"],
  ADMIN: ["/admin"],
  GUEST: ["/guest"],
};

export default auth(async (req: NextRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth as CustomSession;
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

  if (!isLoggedIn && !isPublicRoute) {
    const redirectUrl = new URL("/login", nextUrl);
    const callbackUrl = req.nextUrl.pathname;
    if (callbackUrl !== DEFAULT_LOGIN_REDIRECT) {
      redirectUrl.searchParams.append("callbackUrl", callbackUrl);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoggedIn) {
    const userRolePaths = roleProtectedRoutes[userRole] || [];
    if (!userRolePaths.some(path => nextUrl.pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
