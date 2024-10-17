"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  CheckCheck,
  CircleUser,
  File,
  HandCoins,
  Home,
  Menu,
  NotebookPen,
  Package2,
  ReceiptText,
  ShoppingBasket,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./theme-button";
import { signOut } from "next-auth/react";
import { getUserData } from "@/actions/auth/user.action";
import { log } from "console";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserData();
      console.log("Fetched user:", userData);  // Ensure this logs the correct user data
      if (userData) {
        setUser(userData);
        console.log("User Role:", userData?.role);  // Log user role after setting state
      }
    }
    fetchUser();
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home, roles: ["CFO"] },
    { href: "/customers", label: "Customers", icon: Users, roles: ["CFO"] },
    { href: "/invoices", label: "Invoices", icon: File, roles: ["CFO"] },
    { href: "/items", label: "Items", icon: ShoppingBasket, roles: ["CFO"] },
    { href: "/payments-received", label: "Payments Received", icon: HandCoins, roles: ["CFO"] },
    { href: "/expenses-tracking", label: "Expenses", icon: ReceiptText, roles: ["CFO"] },
    { href: "/projects", label: "Projects", icon: CheckCheck, roles: ["CFO"] },
    { href: "/budget-proposal", label: "Budget Proposals", icon: NotebookPen, roles: ["CFO"] },
    { href: "/admin", label: "Dashboard", icon: Home, roles: ["ADMIN"] },
    { href: "/ceo", label: "Home", icon: Home, roles: ["CEO"] },
    { href: "/ceo/budget-proposal", label: "Budget Proposal", icon: NotebookPen, roles: ["CEO"] },
    { href: "/ceo/startups", label: "Startups", icon: Users, roles: ["CEO"] },
    { href: "/guest", label: "Home", icon: Home, roles: ["GUEST"] },
  ];

  // Conditionally render navbar links based on user data
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r  md:block bg-[#014a97]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold ">
              <Package2 className="h-6 w-6 bg-white" />
              <span className="md:text-2xl text-white">FinEase</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 md:text-lg gap-y-4">
              {user &&
                navLinks.map(
                  (link) =>
                    link.roles.includes(user.role) && (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground ${
                          pathname === link.href ? "text-white bg-primary" : "text-white"
                        }`}
                      >
                        <link.icon className="h-6 w-6" />
                        {link.label}
                      </Link>
                    )
                )}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 bg-[#014a97]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <span className="sr-only">FinEase</span>
                </Link>
                {user &&
                  navLinks.map(
                    (link) =>
                      link.roles.includes(user.role) && (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      )
                  )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>
                <Button variant="ghost" onClick={() => signOut()}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
