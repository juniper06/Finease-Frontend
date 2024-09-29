import { CEOTable } from "@/components/admin/ceo-table";
import { UsersTable } from "@/components/admin/table";
import React from "react";

export default function AdminHome() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
      <main>
        <h1 className="text-lg font-semibold md:text-xl mb-5">Users</h1>
        <UsersTable />
        <h1 className="text-lg font-semibold md:text-xl mb-5">CEO Requests</h1>
        <CEOTable />
      </main>
    </>
  );
}
