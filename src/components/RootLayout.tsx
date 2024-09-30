"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { authRoutes } from "@/lib/routes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (session && !authRoutes.includes(pathname)) {
      const userRole = session.user.role;
      if (userRole === "CEO" && !pathname.startsWith("/ceo")) {
        router.push("/ceo");
      } else if (userRole === "CFO" && !pathname.startsWith("/")) {
        router.push("/");
      } else if (userRole === "ADMIN" && !pathname.startsWith("/admin")) {
        router.push("/admin");
      } else if (userRole === "GUEST" && !pathname.startsWith("/guest")) {
        router.push("/guest");
      }
    }
  }, [session, pathname, router]);
  

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
