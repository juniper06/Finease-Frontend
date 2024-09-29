import Layout from "@/components/Navbar";
import { AddPaymentRecord } from "@/components/cfo/payments/add-form";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function AddPaymentsReceivedPage() {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl w-full">
          Record Payment
        </h1>
      </div>
      <Separator/>
      <AddPaymentRecord/>
    </Layout>
  );
}
