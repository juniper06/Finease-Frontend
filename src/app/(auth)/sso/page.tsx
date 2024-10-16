"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AutoAuthFlow() {
  const searchParams = useSearchParams();

  const jwt = searchParams.get("jwt");
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  useEffect(() => {
    if (!jwt || !userId || !role) return;

    signIn("credentials", {
      jwt,
      userId,
      redirect: false,
    })
      .then((_res) => {
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      })
      .catch((_err) => {
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      });
  }, [jwt, userId, role]);

  return <div>Logging in via SSO from Startup Vest...</div>;
}

export default function Page() {
  return (
    <Suspense>
      <AutoAuthFlow />
    </Suspense>
  );
}
