import LoginForm from "@/components/auth/login-form";
import Link from "next/link";
import React, { Suspense } from "react";

export default async function LoginPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex justify-center items-center col-span-2 md:col-span-1">
        <div className="container max-w-lg space-y-5">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
