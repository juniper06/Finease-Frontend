import Layout from "@/components/Navbar";
import { } from "@/components/cfo/invoices/columns";
import { PaymentsTable } from "@/components/cfo/payments/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function PaymentsPage() {

  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          All Received Payments
        </h1>
        <Button className="flex gap-2 text-md" asChild>
          <Link href="/payments-received/add-payments-received">
            <CirclePlus className="h-6 w-6" />
            New
          </Link>
        </Button>
      </div>
      <Separator />
      <PaymentsTable/>
    </Layout>
  );
}
